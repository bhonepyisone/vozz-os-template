// FILE: src/components/inventory/SupplierManager.jsx

'use client';

import { Truck, Phone } from 'lucide-react';

// Placeholder data
const suppliers = [
  { id: 'SUP-01', name: 'Fresh Veggies Inc.', contact: '555-0101', category: 'Vegetables' },
  { id: 'SUP-02', name: 'Prime Meats Co.', contact: '555-0102', category: 'Meat' },
  { id: 'SUP-03', name: 'Bakery Buns Ltd.', contact: '555-0103', category: 'Bread' },
];

export default function SupplierManager() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Suppliers</h2>
      <div className="space-y-3">
        {suppliers.map(supplier => (
          <div key={supplier.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800 flex items-center"><Truck className="w-4 h-4 mr-2 text-gray-400"/>{supplier.name}</p>
              <p className="text-sm text-gray-500 ml-6">{supplier.category}</p>
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-400"/> {supplier.contact}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}