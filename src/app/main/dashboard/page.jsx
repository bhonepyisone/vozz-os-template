// FILE: src/app/(main)/dashboard/page.jsx

'use client';

// We will create these components later
import KPI_Card from '@/components/dashboard/KPI_Card';
import PerformanceChart from '@/components/dashboard/PerformanceChart';

// Importing icons from lucide-react
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';

// Placeholder data - in the future, this will come from Firebase
const kpiData = [
  {
    title: "Today's Income",
    value: "1,250",
    icon: <DollarSign className="w-6 h-6 text-green-500" />,
    change: "+12.5%",
    changeType: "increase",
  },
  {
    title: "Today's Orders",
    value: "84",
    icon: <ShoppingCart className="w-6 h-6 text-blue-500" />,
    change: "+5.2%",
    changeType: "increase",
  },
  {
    title: "Active Staff",
    value: "12",
    icon: <Users className="w-6 h-6 text-yellow-500" />,
    change: "2",
    changeType: "neutral",
    changeText: "on duty"
  },
  {
    title: "Profit Margin",
    value: "45.8%",
    icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
    change: "-1.2%",
    changeType: "decrease",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Shop Dashboard</h1>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <KPI_Card
            key={index}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            change={kpi.change}
            changeType={kpi.changeType}
            changeText={kpi.changeText}
          />
        ))}
      </div>

      {/* Charts and other info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Weekly Performance
          </h2>
          <div style={{ height: '300px' }}>
             {/* We will create the PerformanceChart component later */}
            <PerformanceChart />
          </div>
        </div>

        {/* Best Performers Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Top Performers
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Best Staff</h3>
              <p className="text-lg font-bold text-gray-800">Jane Doe</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Best Selling Menu</h3>
              <p className="text-lg font-bold text-gray-800">Signature Burger</p>
            </div>
             <div>
              <h3 className="text-sm font-medium text-gray-500">Most Active Customer</h3>
              <p className="text-lg font-bold text-gray-800">John Smith</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
