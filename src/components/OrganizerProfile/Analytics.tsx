"use client";

import { useState } from "react";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { DollarSign, MoreHorizontal, Ticket } from "lucide-react";
import RevenueChart from "./RevenueChart";

const Analytics = () => {
  const [date, setDate] = useState("");
  const [organization, setOrganization] = useState("");

  const stats = [
    {
      title: "Remaining Potential",
      value: "$ 2,736.02",
      change: "+ 1.02%",
      changeColor: "text-rose-500",
      icon: <DollarSign className="h-5 w-5" />,
      iconColor: "text-rose-500 bg-[#1F1F1F] py-2 px-2 rounded-lg",
    },
    {
      title: "Total Tickets Sold",
      value: "850",
      change: "+ 25%",
      changeColor: "text-emerald-500",
      icon: <Ticket className="h-5 w-5" />,
      iconColor: "text-cyan-500 bg-[#1F1F1F] py-2 px-2 rounded-lg",
    },
    {
      title: "Remaining Tickets",
      value: "150",
      change: "+ 10%",
      changeColor: "text-emerald-500",
      icon: <Ticket className="h-5 w-5" />,
      iconColor: "text-cyan-500 bg-[#1F1F1F] py-2 px-2 rounded-lg",
    },
    {
      title: "Total Revenue",
      value: "$ 27,263.98",
      change: "+ 10%",
      changeColor: "text-emerald-500",
      icon: <DollarSign className="h-5 w-5" />,
      iconColor: "text-rose-500 bg-[#1F1F1F] py-2 px-2 rounded-lg",
    },
  ];

  return (
    <div className="bg-[#1F1F1F] rounded-3xl md:rounded-r-3xl mt-28 md:mt-28 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-[#B0B0B0] font-semibold text-lg">
              View your total earnings and event performance in detail.
            </p>
          </div>
          <button className="bg-[#6200EE] hover:bg-[#6200EE]/90 text-white px-6 py-2 rounded flex items-center gap-2 text-lg mt-4 md:mt-0">
            Export Report
            <HiOutlineDocumentReport className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full sm:w-[300px] px-4 py-2 rounded-md bg-zinc-900/60 border border-zinc-800 text-white focus:ring-2 focus:ring-zinc-600 backdrop-blur-sm"
            placeholder="Select date"
          />

          <select
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className="w-full sm:w-[200px] px-4 py-2 rounded-md bg-zinc-900/60 border border-zinc-800 text-white focus:ring-2 focus:ring-zinc-600 backdrop-blur-sm"
          >
            <option value="" disabled>
              Select organization
            </option>
            <option value="artfusion">ArtFusion</option>
            <option value="designco">DesignCo</option>
            <option value="creative">Creative Inc</option>
          </select>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-lg bg-[#121212] p-6 cursor-pointer transition-transform transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className={stat.iconColor}>{stat.icon}</div>
                <button className="text-zinc-400 hover:text-zinc-300">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-between mt-4">
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-normal text-[#B0B0B0]">
                    {stat.title}
                  </p>
                  <p className="text-base font-semibold text-white">
                    {stat.value}
                  </p>
                </div>
                <div className="mt-6 flex flex-col items-center gap-1">
                  <span className={`text-xs ${stat.changeColor}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-[#888888]">vs Last Year</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="mt-8">
          <RevenueChart />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
