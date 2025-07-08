// FILE: src/components/dashboard/KPI_Card.jsx

'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KPI_Card({ title, value, icon, change, changeType, changeText }) {
  const changeColor = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-500',
  };

  const ChangeIcon = {
    increase: <TrendingUp className="w-4 h-4" />,
    decrease: <TrendingDown className="w-4 h-4" />,
    neutral: <Minus className="w-4 h-4" />,
  };

  return (
    // Apply the Neumorphism styles to the card
    <div className="bg-neo-bg p-6 rounded-2xl shadow-neo-md flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        {change && (
          <div className={`flex items-center text-sm mt-1 ${changeColor[changeType]}`}>
            {ChangeIcon[changeType]}
            <span className="ml-1">
              {change} {changeText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
