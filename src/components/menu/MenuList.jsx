// FILE: src/components/menu/MenuList.jsx

'use client';

// Placeholder data
const menuItems = [
  { id: 'M-01', name: 'Signature Burger', category: 'Mains', price: 1250 },
  { id: 'M-02', name: 'Classic Pizza', category: 'Mains', price: 1500 },
  { id: 'M-03', name: 'Caesar Salad', category: 'Starters', price: 800 },
  { id: 'M-04', name: 'Iced Coffee', category: 'Drinks', price: 450 },
];

export default function MenuList() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Menu Items</h2>
      <div className="space-y-4">
        {menuItems.map(item => (
          <div key={item.id} className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50">
            <div>
              <p className="font-bold text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-semibold text-gray-700">{item.price.toLocaleString()}</p>
              <button className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}