// FILE: src/app/(main)/pos/page.jsx

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, runTransaction, Timestamp, onSnapshot, setDoc, getDoc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { useAuthStore } from '@/lib/auth';
import FloorPlan from '@/components/pos/FloorPlan';
import OrderPanel from '@/components/pos/OrderPanel';
import PaymentModal from '@/components/pos/PaymentModal';
import PosMenuGrid from '@/components/pos/PosMenuGrid';
import CustomerSelectModal from '@/components/pos/CustomerSelectModal';
import SalesRecord from '@/components/pos/SalesRecord';
import SuccessModal from '@/components/ui/SuccessModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import ReceiptModal from '@/components/pos/ReceiptModal'; // Import the new component
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import { Printer } from 'lucide-react';

export default function PosPage() {
  const { user } = useAuthStore();
  const [currentOrder, setCurrentOrder] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taxPercent, setTaxPercent] = useState(7);
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  
  // New state for printing
  const [lastCompletedOrder, setLastCompletedOrder] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const { subtotal, taxAmount, total } = useMemo(() => {
    const sub = currentOrder.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    const numericTax = Number(taxPercent);
    const currentTaxPercent = isNaN(numericTax) ? 0 : numericTax;
    const tax = sub * (currentTaxPercent / 100);
    const tot = sub + tax;
    return { subtotal: sub, taxAmount: tax, total: tot };
  }, [currentOrder, taxPercent]);

  const handleTaxChange = (e) => {
    setTaxPercent(e.target.value);
  };
  
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(false);
  };

  const updateActiveOrder = useCallback(async (newOrder, table, customer) => {
    if (!table) return;
    
    const sub = newOrder.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    const numericTax = Number(taxPercent);
    const currentTaxPercent = isNaN(numericTax) ? 0 : numericTax;
    const tax = sub * (currentTaxPercent / 100);
    const tot = sub + tax;

    const orderData = {
      items: newOrder,
      totalAmount: tot,
      subtotal: sub,
      taxPercent: currentTaxPercent,
      taxAmount: tax,
      tableId: table.id,
      tableName: table.name,
      customerId: customer?.id || null,
      customerName: customer?.name || 'Walk-in',
    };

    const tableRef = doc(db, 'tables', table.id);
    await updateDoc(tableRef, {
      customerName: orderData.customerName,
      orderTotal: orderData.totalAmount,
      activeOrder: {
        items: orderData.items.map(i => ({ name: i.name, quantity: i.quantity }))
      }
    });

    if (table.activeOrderId) {
      const orderRef = doc(db, 'activeOrders', table.activeOrderId);
      await setDoc(orderRef, orderData, { merge: true });
    } else {
      const newOrderRef = doc(collection(db, 'activeOrders'));
      await setDoc(newOrderRef, orderData);
      await updateDoc(tableRef, { 
        activeOrderId: newOrderRef.id,
        status: 'Order Taken'
      });
    }
  }, [taxPercent]);

  useEffect(() => {
    if (selectedTable) {
      updateActiveOrder(currentOrder, selectedTable, selectedCustomer);
    }
  }, [currentOrder, selectedCustomer, selectedTable, updateActiveOrder]);

  const handleTableSelect = useCallback(async (table) => {
    setSelectedTable(table);
    if (table.activeOrderId) {
      const orderRef = doc(db, 'activeOrders', table.activeOrderId);
      const orderSnap = await getDoc(orderRef);
      if (orderSnap.exists()) {
        const orderData = orderSnap.data();
        setCurrentOrder(orderData.items || []);
        setTaxPercent(orderData.taxPercent ?? 7);
        if(orderData.customerId) {
          const custRef = doc(db, 'customers', orderData.customerId);
          const custSnap = await getDoc(custRef);
          if(custSnap.exists()) setSelectedCustomer({id: custSnap.id, ...custSnap.data()});
        } else {
          setSelectedCustomer(null);
        }
      }
    } else {
      setCurrentOrder([]);
      setSelectedCustomer(null);
      setTaxPercent(7);
    }
  }, []);
  
  const handleAddItem = (itemToAdd) => {
    if (!selectedTable) {
      alert("Please select a table first!");
      return;
    }
    setCurrentOrder(prev => {
      const existing = prev.find(i => i.id === itemToAdd.id);
      if (existing) {
        return prev.map(i => i.id === itemToAdd.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...itemToAdd, quantity: 1 }];
    });
  };

  const handleRemoveItem = (index) => {
    setCurrentOrder(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearOrder = async () => {
    if (confirm("Are you sure you want to clear this order? This will reset the table.")) {
      if(selectedTable && selectedTable.activeOrderId){
        await deleteDoc(doc(db, 'activeOrders', selectedTable.activeOrderId));
        await updateDoc(doc(db, 'tables', selectedTable.id), {
          status: 'Open', activeOrderId: null, customerName: null, orderTotal: null, activeOrder: null
        });
      }
      setCurrentOrder([]);
      setSelectedCustomer(null);
      setSelectedTable(null);
    }
  };

  const handleConfirmPayment = async (paymentMethod) => {
    if (currentOrder.length === 0 || !user || !selectedTable) return;
    setIsLoading(true);

    const orderToProcess = {
        items: currentOrder,
        totalAmount: total,
        subtotal: subtotal,
        taxAmount: taxAmount,
        taxPercent: Number(taxPercent) || 0,
        paymentMethod,
        shopId: user.shopId,
        createdBy: user.uid,
        createdAt: Timestamp.now(),
        customerId: selectedCustomer?.id || null,
        customerName: selectedCustomer?.name || 'Walk-in',
        tableId: selectedTable.id,
    };

    try {
      const updatedInventoryItemsInfo = [];

      await runTransaction(db, async (transaction) => {
        const inventoryUpdates = [];
        for (const orderItem of currentOrder) {
          if (orderItem.recipe && orderItem.recipe.length > 0) {
            for (const ingredient of orderItem.recipe) {
              const invRef = doc(db, 'inventory', ingredient.inventoryId);
              const invDoc = await transaction.get(invRef);
              if (!invDoc.exists()) throw new Error(`Inventory item ${ingredient.name} not found!`);
              
              const itemData = invDoc.data();
              const newStock = itemData.currentStock - (ingredient.quantity * orderItem.quantity);
              inventoryUpdates.push({ ref: invRef, newStock });

              updatedInventoryItemsInfo.push({ name: itemData.name, newStock: newStock, minStock: itemData.minStock });
            }
          }
        }

        transaction.set(doc(collection(db, 'sales')), orderToProcess);

        if (selectedTable.activeOrderId) {
          transaction.delete(doc(db, 'activeOrders', selectedTable.activeOrderId));
        }

        transaction.update(doc(db, 'tables', selectedTable.id), {
          status: 'Needs Cleaning', activeOrderId: null, customerName: null, orderTotal: null, activeOrder: null
        });

        for (const update of inventoryUpdates) {
          transaction.update(update.ref, { currentStock: update.newStock });
        }
      });

      for (const item of updatedInventoryItemsInfo) {
        if (item.newStock <= item.minStock) {
          await addDoc(collection(db, 'notifications'), {
            type: 'Low Stock',
            message: `Heads up! '${item.name}' are running low. Current stock: ${item.newStock}`,
            createdAt: Timestamp.now(),
          });
        }
      }

      setLastCompletedOrder(orderToProcess);
      setSuccessMessage("Sale recorded and inventory updated!");
      setCurrentOrder([]);
      setSelectedCustomer(null);
      setSelectedTable(null);
      setIsPaymentModalOpen(false);

    } catch (error) {
      console.error("Transaction failed: ", error);
      alert(`Failed to process order: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        <div className="lg:col-span-2 space-y-8">
          <FloorPlan onTableSelect={handleTableSelect} selectedTable={selectedTable} />
          <PosMenuGrid onAddItem={handleAddItem} />
          <SalesRecord />
        </div>
        <div className="lg:col-span-1">
          <OrderPanel 
            orderItems={currentOrder} 
            onProcessPayment={() => setIsPaymentModalOpen(true)}
            onRemoveItem={handleRemoveItem}
            selectedCustomer={selectedCustomer}
            onSelectCustomerClick={() => setIsCustomerModalOpen(true)}
            selectedTable={selectedTable}
            onClearOrder={handleClearOrder}
            taxPercent={taxPercent}
            onTaxChange={handleTaxChange}
            subtotal={subtotal}
            taxAmount={taxAmount}
            total={total}
          />
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handleConfirmPayment}
        total={total}
        isLoading={isLoading}
      />
      <CustomerSelectModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSelectCustomer={handleSelectCustomer}
      />
      <SuccessModal
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        title="Success!"
        actions={
            <NeumorphismButton onClick={() => setIsReceiptModalOpen(true)} className="!text-blue-600">
                <Printer className="w-5 h-5 mr-2"/>
                Print Receipt
            </NeumorphismButton>
        }
      >
        {successMessage}
      </SuccessModal>
      
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        order={lastCompletedOrder}
      />
      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false })}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
      >
        {confirmState.message}
      </ConfirmationModal>
    </>
  );
}
