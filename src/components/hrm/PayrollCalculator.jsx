// FILE: src/components/hrm/PayrollCalculator.jsx

'use client';

import { Calculator, Send } from 'lucide-react';

export default function PayrollCalculator() {
  
  const handleRunPayroll = () => {
    // Logic for calculating payroll based on timesheets and roles
    console.log("Running payroll calculation...");
    alert("Payroll for the period has been calculated and processed (simulation)!");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Run Payroll</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="payPeriod" className="block text-sm font-medium text-gray-700">Pay Period</label>
          <select id="payPeriod" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
            <option>July 1 - July 15, 2025</option>
            <option>July 16 - July 31, 2025</option>
          </select>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-500">Total Estimated Payroll</p>
          <p className="text-3xl font-bold text-gray-900">125,500</p>
        </div>
        <button
          onClick={handleRunPayroll}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
        >
          <Send className="w-5 h-5 mr-2" />
          Calculate & Process Payroll
        </button>
      </div>
    </div>
  );
}