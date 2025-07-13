// FILE: src/components/dashboard/PerformanceChart.jsx

'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const BarChart = dynamic(
  () => import('recharts').then(mod => mod.BarChart),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
  }
);

import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// The component now accepts data as a prop
export default function PerformanceChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
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
        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(5px)',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
          }}
        />
        <Legend />
        <Bar dataKey="Income" fill="#6366F1" name="Income" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
}
