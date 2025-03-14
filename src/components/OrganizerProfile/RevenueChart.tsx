import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'JAN', thisYear: 8000, lastYear: 6000 },
  { month: 'FEB', thisYear: 12000, lastYear: 8000 },
  { month: 'MAR', thisYear: 15000, lastYear: 10000 },
  { month: 'APR', thisYear: 18000, lastYear: 12000 },
  { month: 'MAY', thisYear: 16000, lastYear: 14000 },
  { month: 'JUN', thisYear: 17000, lastYear: 13000 },
  { month: 'JUL', thisYear: 15000, lastYear: 15000 },
  { month: 'AUG', thisYear: 18000, lastYear: 12000 },
  { month: 'SEP', thisYear: 16000, lastYear: 14000 },
  { month: 'OCT', thisYear: 17000, lastYear: 11000 },
  { month: 'NOV', thisYear: 15000, lastYear: 13000 },
  { month: 'DEC', thisYear: 19000, lastYear: 12000 }
];

const RevenueChart = () => {
  return (
    <div className="bg-[#121212] p-6 rounded-lg">
      <h3 className="text-white/90 text-base mb-4">
        Total Revenue <span className="text-gray-400">(This Year vs Last Year)</span>
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#333"
            />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
              ticks={[0, 5000, 10000, 15000, 20000]}
              tickFormatter={(value) => `${value/1000}K`}
            />
            <Line
              type="monotone"
              dataKey="thisYear"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="lastYear"
              stroke="#374151"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-4 mt-4 justify-end">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
          <span className="text-gray-400 text-sm">This Year</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
          <span className="text-gray-400 text-sm">Last Year</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;