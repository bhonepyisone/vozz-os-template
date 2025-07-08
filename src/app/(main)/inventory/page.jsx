// FILE: src/app/(main)/inventory/page.jsx

'use client';

import StockList from '@/components/inventory/StockList';
import PurchaseOrderForm from '@/components/inventory/PurchaseOrderForm';
import SupplierManager from '@/components/inventory/SupplierManager';

export default function InventoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Inventory Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Section: Stock List */}
        <div className="lg:col-span-2">
          <StockList />
        </div>

        {/* Right Section: Forms and Suppliers */}
        <div className="space-y-8">
          <PurchaseOrderForm />
          <SupplierManager />
        </div>

      </div>
    </div>
  );
}
