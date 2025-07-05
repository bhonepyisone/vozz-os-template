// FILE: src/components/pos/FloorPlan.jsx

'use client';

// Placeholder data
const tables = [
  { id: 1, name: 'T1', status: 'Open' },
  { id: 2, name: 'T2', status: 'Seated' },
  { id: 3, name: 'T3', status: 'Order Taken' },
  { id: 4, name: 'T4', status: 'Open' },
  { id: 5, name: 'T5', status: 'Food Served' },
  { id: 6, name: 'T6', status: 'Bill Printed' },
  { id: 7, name: 'T7', status: 'Needs Cleaning' },
  { id: 8, name: 'T8', status: 'Reserved' },
];

const Table = ({ table }) => {
  const statusStyles = {
    Open: 'bg-green-100 border-green-400 text-green-800',
    Seated: 'bg-blue-100 border-blue-400 text-blue-800',
    'Order Taken': 'bg-indigo-100 border-indigo-400 text-indigo-800',
    'Food Served': 'bg-purple-100 border-purple-400 text-purple-800',
    'Bill Printed': 'bg-yellow-100 border-yellow-400 text-yellow-800',
    'Needs Cleaning': 'bg-red-100 border-red-400 text-red-800',
    Reserved: 'bg-gray-200 border-gray-400 text-gray-800',
  };

  return (
    <div className={`w-24 h-24 flex flex-col items-center justify-center rounded-lg border-2 cursor-pointer transition-transform hover:scale-105 ${statusStyles[table.status]}`}>
      <p className="font-bold text-xl">{table.name}</p>
      <p className="text-xs mt-1">{table.status}</p>
    </div>
  );
};

export default function FloorPlan() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Floor Plan</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {tables.map(table => (
          <Table key={table.id} table={table} />
        ))}
      </div>
    </div>
  );
}