// FILE: src/components/inventory/PurchaseOrderForm.jsx

'use client';

import { Send } from 'lucide-react';

export default function PurchaseOrderForm() {
  
  const handleSendPO = (e) => {
    e.preventDefault();
    console.log("Sending Purchase Order...");
    alert("Purchase Order has been created and sent (simulation)!");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Purchase Order</h2>
      <form onSubmit={handleSendPO} className="space-y-4">
        <div>
          <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Supplier</label>
          <select id="supplier" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
            <option>Fresh Veggies Inc.</option>
            <option>Prime Meats Co.</option>
            <option>Bakery Buns Ltd.</option>
          </select>
        </div>
        <div>
          <label htmlFor="item" className="block text-sm font-medium text-gray-700">Item</label>
          <input type="text" id="item" placeholder="e.g., Beef Patties" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
          <input type="number" id="quantity" placeholder="e.g., 50" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
        </div>
        <button type="submit" className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
          <Send className="w-5 h-5 mr-2" />
          Create & Send PO
        </button>
      </form>
    </div>
  );
}