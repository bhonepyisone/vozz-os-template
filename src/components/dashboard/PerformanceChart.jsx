// FILE: src/components/dashboard/PerformanceChart.jsx

'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from 'recharts';

// Placeholder data - this will come from your analytics data
const data = [
  { name: 'Mon', Income: 4000, Profit: 2400 },
  { name: 'Tue', Income: 3000, Profit: 1398 },
  { name: 'Wed', Income: 2000, Profit: 9800 },
  { name: 'Thu', Income: 2780, Profit: 3908 },
  { name: 'Fri', Income: 1890, Profit: 4800 },
  { name: 'Sat', Income: 2390, Profit: 3800 },
  { name: 'Sun', Income: 3490, Profit: 4300 },
];

export default function PerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
        <YAxis yAxisId="left" tick={{ fill: '#6b7280', fontSize: 12 }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6b7280', fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(5px)',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="Income" fill="#8B5CF6" name="Income" barSize={20} />
        <Line yAxisId="right" type="monotone" dataKey="Profit" stroke="#EC4899" name="Profit" strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
