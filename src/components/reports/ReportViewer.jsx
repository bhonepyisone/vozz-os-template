// FILE: src/components/reports/ReportViewer.jsx

'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';

// In a real app, these components would be imported
const SalesReport = () => <div className="p-4 bg-gray-50 rounded-lg">Displaying detailed sales analytics...</div>;
const InventoryReport = () => <div className="p-4 bg-gray-50 rounded-lg">Displaying stock valuation and turnover rates...</div>;
const FinancialReport = () => <div className="p-4 bg-gray-50 rounded-lg">Displaying Profit & Loss and expense summaries...</div>;

const reportComponents = {
  sales: <SalesReport />,
  inventory: <InventoryReport />,
  financials: <FinancialReport />,
};

export default function ReportViewer() {
  const [selectedReport, setSelectedReport] = useState('sales');

  const ReportComponent = reportComponents[selectedReport];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FileText className="w-6 h-6 mr-3 text-primary" />
          Report Viewer
        </h2>
        <div>
          <label htmlFor="reportType" className="sr-only">Select Report</label>
          <select
            id="reportType"
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="sales">Sales Analytics</option>
            <option value="inventory">Inventory Report</option>
            <option value="financials">Financial Report</option>
          </select>
        </div>
      </div>
      
      <div>
        {ReportComponent}
      </div>
    </div>
  );
}