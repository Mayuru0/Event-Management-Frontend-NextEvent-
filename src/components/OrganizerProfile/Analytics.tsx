"use client";

import { HiOutlineDocumentReport } from "react-icons/hi";
import { DollarSign, Ticket, MoreHorizontal } from "lucide-react";
import RevenueChart from "./RevenueChart";
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";
import { useGetTicketsorganizerIdQuery } from "@/Redux/features/ticketApiSlice";
import { useGetEventsByOrganizeridQuery } from "@/Redux/features/eventApiSlice";

const Analytics = () => {
  const user = useSelector(selectuser);
  const organizerId = user?._id as string;

  const { data: tickets = [], isLoading: ticketsLoading } = useGetTicketsorganizerIdQuery(organizerId, { skip: !organizerId });
  const { data: events = [], isLoading: eventsLoading } = useGetEventsByOrganizeridQuery(organizerId, { skip: !organizerId });

  const isLoading = ticketsLoading || eventsLoading;

  // Compute stats from real data
  const confirmedTickets = tickets.filter((t) => t.status === "confirmed");

  const totalTicketsSold = confirmedTickets.reduce((sum, t) => sum + t.quantity, 0);
  const totalRevenue = confirmedTickets.reduce((sum, t) => sum + t.totalPrice, 0);
  const totalEventCapacity = events.reduce((sum, e) => sum + e.quantity, 0);
  const remainingTickets = Math.max(0, totalEventCapacity - totalTicketsSold);
  const avgTicketPrice = events.length > 0
    ? events.reduce((sum, e) => sum + e.ticket_price, 0) / events.length
    : 0;
  const remainingPotential = remainingTickets * avgTicketPrice;

  // Monthly revenue breakdown
  const currentYear = new Date().getFullYear();
  const thisYearData = Array(12).fill(0);
  const lastYearData = Array(12).fill(0);

  confirmedTickets.forEach((ticket) => {
    const date = new Date(ticket.timestamp || ticket.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    if (year === currentYear) {
      thisYearData[month] += ticket.totalPrice;
    } else if (year === currentYear - 1) {
      lastYearData[month] += ticket.totalPrice;
    }
  });

  const stats = [
    {
      title: "Remaining Potential",
      value: `$${remainingPotential.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      sub: `${remainingTickets} tickets left`,
      icon: <DollarSign className="h-5 w-5" />,
      iconColor: "text-rose-500 bg-[#1F1F1F] py-2 px-2 rounded-lg",
      changeColor: "text-rose-400",
    },
    {
      title: "Total Tickets Sold",
      value: totalTicketsSold.toLocaleString(),
      sub: `${confirmedTickets.length} orders`,
      icon: <Ticket className="h-5 w-5" />,
      iconColor: "text-cyan-500 bg-[#1F1F1F] py-2 px-2 rounded-lg",
      changeColor: "text-emerald-400",
    },
    {
      title: "Remaining Tickets",
      value: remainingTickets.toLocaleString(),
      sub: `of ${totalEventCapacity} capacity`,
      icon: <Ticket className="h-5 w-5" />,
      iconColor: "text-cyan-500 bg-[#1F1F1F] py-2 px-2 rounded-lg",
      changeColor: "text-yellow-400",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      sub: "confirmed orders",
      icon: <DollarSign className="h-5 w-5" />,
      iconColor: "text-emerald-500 bg-[#1F1F1F] py-2 px-2 rounded-lg",
      changeColor: "text-emerald-400",
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-[#1F1F1F] rounded-3xl md:rounded-r-3xl mt-28 p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-white text-xl font-semibold animate-pulse">Loading Analytics...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1F1F1F] rounded-3xl md:rounded-r-3xl mt-28 md:mt-28 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-[#B0B0B0] font-semibold text-lg">
              View your total earnings and event performance in detail.
            </p>
          </div>
          <button className="bg-[#6200EE] hover:bg-[#4B00D1] text-white px-6 py-2 rounded flex items-center gap-2 text-lg mt-4 md:mt-0 transition-colors">
            Export Report
            <HiOutlineDocumentReport className="w-5 h-5" />
          </button>
        </div>

        {/* Events Summary Row */}
        <div className="mb-6 p-4 bg-[#121212] rounded-xl flex flex-wrap gap-4 items-center">
          <div className="text-[#B0B0B0] text-sm">
            <span className="text-white font-semibold">{events.length}</span> total events
          </div>
          <div className="w-px h-4 bg-gray-700" />
          <div className="text-[#B0B0B0] text-sm">
            <span className="text-cyan-400 font-semibold">
              {events.filter((e) => e.status === "Published").length}
            </span> published
          </div>
          <div className="w-px h-4 bg-gray-700" />
          <div className="text-[#B0B0B0] text-sm">
            <span className="text-yellow-400 font-semibold">
              {events.filter((e) => e.status === "Pending").length}
            </span> pending approval
          </div>
          <div className="w-px h-4 bg-gray-700" />
          <div className="text-[#B0B0B0] text-sm">
            <span className="text-gray-400 font-semibold">
              {events.filter((e) => e.status === "Archived").length}
            </span> archived
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl bg-[#121212] p-6 cursor-pointer transition-transform transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className={stat.iconColor}>{stat.icon}</div>
                <button className="text-zinc-400 hover:text-zinc-300">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-xs font-normal text-[#B0B0B0]">{stat.title}</p>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className={`text-xs ${stat.changeColor}`}>{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="mt-8">
          <RevenueChart thisYearData={thisYearData} lastYearData={lastYearData} />
        </div>

        {/* Per-Event Breakdown */}
        {events.length > 0 && (
          <div className="mt-8">
            <h3 className="text-white font-semibold text-lg mb-4">Event Breakdown</h3>
            <div className="space-y-3">
              {events.map((event) => {
                const eventTickets = confirmedTickets.filter((t) => t.event_title === event.title);
                const eventRevenue = eventTickets.reduce((sum, t) => sum + t.totalPrice, 0);
                const eventSold = eventTickets.reduce((sum, t) => sum + t.quantity, 0);
                const capacity = event.quantity;
                const pct = capacity > 0 ? Math.min(100, Math.round((eventSold / capacity) * 100)) : 0;

                return (
                  <div key={event._id} className="bg-[#121212] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white font-medium text-sm">{event.title}</p>
                        <p className="text-[#B0B0B0] text-xs">{event.event_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-cyan-400 font-bold">${eventRevenue.toLocaleString()}</p>
                        <p className="text-[#B0B0B0] text-xs">{eventSold}/{capacity} sold</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div
                        className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-right text-xs text-[#B0B0B0] mt-1">{pct}% sold</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
