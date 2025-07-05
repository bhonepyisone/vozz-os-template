// FILE: src/components/inventory/StockList.jsx

'use client';

// Placeholder data - this will come from your 'inventory' collection
const inventory = [
  { id: 'INV-001', name: 'Beef Patties', currentStock: 50, minStock: 20, unit: 'pieces' },
  { id: 'INV-002', name: 'Burger Buns', currentStock: 25, minStock: 30, unit: 'pieces' },
  { id: 'INV-003', name: 'Tomatoes', currentStock: 30, minStock: 10, unit: 'kg' },
  { id: 'INV-004', name: 'Coffee Beans', currentStock: 8, minStock: 5, unit: 'kg' },
  { id: 'INV-005', name: 'Milk', currentStock: 4, minStock: 10, unit: 'liters' },
];

const StockLevelIndicator = ({ current, min }) => {
  const level = current / (min * 2); // Simple ratio for indicator
  let color = 'bg-green-500';
  if (level < 0.5) color = 'bg-yellow-500';
  if (current <= min) color = 'bg-red-500';

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className={`${color} h-2.5 rounded-full`} style={{ width: `${Math.min(level * 100, 100)}%` }}></div>
    </div>
  );
};

export default function StockList() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Stock Levels</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current / Min Stock</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-1/3">
                  <StockLevelIndicator current={item.currentStock} min={item.minStock} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.currentStock} / {item.minStock} {item.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}