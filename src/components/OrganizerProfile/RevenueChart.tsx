"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MONTH_LABELS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

interface RevenueChartProps {
  thisYearData?: number[];
  lastYearData?: number[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ thisYearData, lastYearData }) => {
  const data = MONTH_LABELS.map((month, i) => ({
    month,
    thisYear: thisYearData?.[i] ?? 0,
    lastYear: lastYearData?.[i] ?? 0,
  }));

  const maxValue = Math.max(...data.flatMap((d) => [d.thisYear, d.lastYear]), 1000);
  const yMax = Math.ceil(maxValue / 1000) * 1000;

  return (
    <div className="bg-[#121212] p-6 rounded-2xl ">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/90 text-base font-semibold">
          Total Revenue{" "}
          <span className="text-gray-400 font-normal">(This Year vs Last Year)</span>
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded-full" />
            <span className="text-gray-400 text-xs">This Year</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-600 rounded-full" />
            <span className="text-gray-400 text-xs">Last Year</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 11 }}
              tickFormatter={(v) => (v >= 1000 ? `$${v / 1000}K` : `$${v}`)}
              domain={[0, yMax]}
              width={50}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1F1F1F", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              labelStyle={{ color: "#B0B0B0" }}
            />
            <Line
              type="monotone"
              dataKey="thisYear"
              name="This Year"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#06b6d4" }}
            />
            <Line
              type="monotone"
              dataKey="lastYear"
              name="Last Year"
              stroke="#4B5563"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, fill: "#4B5563" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
