// FILE: src/components/hrm/LeaveManager.jsx

'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';

// Placeholder data
const initialRequests = [
  { id: 'LR-01', staffName: 'John Smith', type: 'Annual Leave', dates: 'Aug 5 - Aug 8, 2025' },
  { id: 'LR-02', staffName: 'Jane Doe', type: 'Sick Leave', dates: 'July 28, 2025' },
];

export default function LeaveManager() {
  const [requests, setRequests] = useState(initialRequests);

  const handleRequest = (id, status) => {
    console.log(`Request ${id} has been ${status}`);
    setRequests(requests.filter(req => req.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Leave Requests</h2>
      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map(req => (
            <div key={req.id} className="p-4 border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">{req.staffName}</p>
                <p className="text-sm text-gray-600">{req.type}: <span className="font-medium">{req.dates}</span></p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => handleRequest(req.id, 'approved')} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200">
                  <Check className="w-5 h-5" />
                </button>
                <button onClick={() => handleRequest(req.id, 'denied')} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No pending leave requests.</p>
        )}
      </div>
    </div>
  );
}