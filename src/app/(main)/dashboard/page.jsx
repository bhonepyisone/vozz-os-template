// FILE: src/app/(main)/dashboard/page.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, doc, getDoc } from 'firebase/firestore';
import { useAuthStore } from '@/lib/auth';
import { format, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfWeek, endOfWeek } from 'date-fns';

import KPI_Card from '@/components/dashboard/KPI_Card';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import AnnouncementFeed from '@/components/dashboard/AnnouncementFeed';
import KudosFeed from '@/components/dashboard/KudosFeed';
import Card from '@/components/ui/Card'; // Import the themed Card
import { Loader2, DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';

const timeframes = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [activeTimeframe, setActiveTimeframe] = useState('Daily');
  const [dashboardData, setDashboardData] = useState({
    income: 0,
    orders: 0,
    activeStaff: 12,
    profitMargin: 45.8,
  });
  const [chartData, setChartData] = useState([]);
  const [topPerformers, setTopPerformers] = useState({
    bestStaff: 'N/A',
    bestMenuItem: 'N/A',
    mostActiveCustomer: 'N/A',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.shopId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);

      const now = new Date();
      let startDate, endDate;

      switch (activeTimeframe) {
        case 'Weekly':
          startDate = startOfWeek(now, { weekStartsOn: 1 });
          endDate = endOfWeek(now, { weekStartsOn: 1 });
          break;
        case 'Monthly':
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        case 'Yearly':
          startDate = startOfYear(now);
          endDate = endOfYear(now);
          break;
        default: // Daily
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          endDate = endOfDay(now);
          break;
      }
      
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);
      
      try {
        const salesRef = collection(db, 'sales');
        const q = query(
          salesRef,
          where('shopId', '==', user.shopId),
          where('createdAt', '>=', startTimestamp),
          where('createdAt', '<=', endTimestamp)
        );

        const querySnapshot = await getDocs(q);
        const salesDocs = querySnapshot.docs.map(doc => doc.data());
        
        let totalIncome = 0;
        let totalOrders = 0;
        
        const staffSales = {};
        const itemCounts = {};
        const customerSales = {};

        salesDocs.forEach(sale => {
          totalIncome += sale.totalAmount;
          totalOrders += 1;

          if (sale.createdBy) {
            staffSales[sale.createdBy] = (staffSales[sale.createdBy] || 0) + sale.totalAmount;
          }

          if (sale.items && Array.isArray(sale.items)) {
            sale.items.forEach(item => {
              itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
            });
          }
          
          if (sale.customerId) {
            customerSales[sale.customerId] = (customerSales[sale.customerId] || 0) + sale.totalAmount;
          }
        });

        const bestStaffId = Object.keys(staffSales).reduce((a, b) => staffSales[a] > staffSales[b] ? a : b, null);
        const bestMenuItemName = Object.keys(itemCounts).reduce((a, b) => itemCounts[a] > itemCounts[b] ? a : b, 'N/A');
        const topCustomerId = Object.keys(customerSales).reduce((a, b) => customerSales[a] > customerSales[b] ? a : b, null);

        let bestStaffName = 'N/A';
        if (bestStaffId) {
          const userDoc = await getDoc(doc(db, 'users', bestStaffId));
          if (userDoc.exists()) bestStaffName = userDoc.data().name;
        }

        let topCustomerName = 'N/A';
        if (topCustomerId) {
          const customerDoc = await getDoc(doc(db, 'customers', topCustomerId));
          if (customerDoc.exists()) topCustomerName = customerDoc.data().name;
        }

        setTopPerformers({
          bestStaff: bestStaffName,
          bestMenuItem: bestMenuItemName,
          mostActiveCustomer: topCustomerName,
        });
        
        const salesForChart = salesDocs.map(sale => ({
            amount: sale.totalAmount,
            date: sale.createdAt.toDate()
        }));

        let processedChartData = [];
        if (activeTimeframe === 'Daily') {
            const hourlySales = Array(24).fill(0);
            salesForChart.forEach(sale => {
                const hour = sale.date.getHours();
                hourlySales[hour] += sale.amount;
            });
            processedChartData = hourlySales.map((income, hour) => ({ name: `${hour}:00`, Income: income }));
        } else if (activeTimeframe === 'Weekly') {
            const weeklySales = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
            salesForChart.forEach(sale => {
                const day = format(sale.date, 'E');
                weeklySales[day] += sale.amount;
            });
            processedChartData = Object.entries(weeklySales).map(([day, income]) => ({ name: day, Income: income }));
        } else if (activeTimeframe === 'Monthly') {
            const monthlySales = {};
            salesForChart.forEach(sale => {
                const dayOfMonth = format(sale.date, 'd');
                monthlySales[dayOfMonth] = (monthlySales[dayOfMonth] || 0) + sale.amount;
            });
            processedChartData = Object.entries(monthlySales).map(([day, income]) => ({ name: `Day ${day}`, Income: income }));
        } else if (activeTimeframe === 'Yearly') {
            const yearlySales = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 };
            salesForChart.forEach(sale => {
                const month = format(sale.date, 'MMM');
                yearlySales[month] += sale.amount;
            });
            processedChartData = Object.entries(yearlySales).map(([month, income]) => ({ name: month, Income: income }));
        }
        setChartData(processedChartData);

        setDashboardData(prevData => ({
          ...prevData,
          income: totalIncome,
          orders: totalOrders,
        }));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, activeTimeframe]);

  const kpiData = [
    { title: `${activeTimeframe} Income`, value: dashboardData.income.toLocaleString(), icon: <DollarSign className="w-6 h-6 text-green-500" /> },
    { title: `${activeTimeframe} Orders`, value: dashboardData.orders.toLocaleString(), icon: <ShoppingCart className="w-6 h-6 text-blue-500" /> },
    { title: "Active Staff", value: dashboardData.activeStaff.toLocaleString(), icon: <Users className="w-6 h-6 text-yellow-500" /> },
    { title: "Profit Margin", value: `${dashboardData.profitMargin}%`, icon: <TrendingUp className="w-6 h-6 text-purple-500" /> },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700" style={{textShadow: '1px 1px 1px #ffffff'}}>Shop Dashboard</h1>
        <div className="flex items-center bg-neo-bg p-1 rounded-lg shadow-neo-inset-active">
          {timeframes.map(frame => (
            <button 
              key={frame}
              onClick={() => setActiveTimeframe(frame)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                activeTimeframe === frame ? 'bg-neo-bg shadow-neo-md text-primary' : 'text-gray-600'
              }`}
            >
              {frame}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => (
              <KPI_Card key={index} title={kpi.title} value={kpi.value} icon={kpi.icon} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title={`${activeTimeframe} Performance`} className="lg:col-span-2">
              <div style={{ height: '300px' }}><PerformanceChart data={chartData} /></div>
            </Card>
            <Card title="Top Performers">
              <div className="space-y-4">
                <div><h3 className="text-sm font-medium text-gray-500">Best Staff</h3><p className="text-lg font-bold text-gray-800">{topPerformers.bestStaff}</p></div>
                <div><h3 className="text-sm font-medium text-gray-500">Best Selling Menu</h3><p className="text-lg font-bold text-gray-800">{topPerformers.bestMenuItem}</p></div>
                <div><h3 className="text-sm font-medium text-gray-500">Most Active Customer</h3><p className="text-lg font-bold text-gray-800">{topPerformers.mostActiveCustomer}</p></div>
              </div>
            </Card>
          </div>
          <Card title="Recent Announcements">
            <AnnouncementFeed />
          </Card>
          <Card title="Recent Kudos">
            <KudosFeed />
          </Card>
        </div>
      )}
    </div>
  );
}
