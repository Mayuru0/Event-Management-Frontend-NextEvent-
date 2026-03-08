"use client";

import { CreditCard, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";
import { useGetTicketsorganizerIdQuery } from "@/Redux/features/ticketApiSlice";

function Wallet() {
  const user = useSelector(selectuser);
  const organizerId = user?._id as string;

  const { data: tickets = [], isLoading, isError } = useGetTicketsorganizerIdQuery(organizerId, {
    skip: !organizerId,
  });

  const confirmedTickets = tickets.filter((t) => t.status === "confirmed");
  const totalBalance = confirmedTickets.reduce((sum, t) => sum + t.totalPrice, 0);
  const pendingBalance = tickets
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.totalPrice, 0);

  if (isLoading) {
    return (
      <div className="p-6 py-28 max-w-4xl mx-auto mt-28 flex items-center justify-center min-h-[400px]">
        <p className="text-white text-xl font-semibold animate-pulse">Loading Wallet...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 py-28 max-w-4xl mx-auto mt-28">
        <p className="text-red-500 text-lg font-semibold">Failed to load wallet data.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 py-10 max-w-4xl mx-auto bg-transparent rounded-3xl md:rounded-r-3xl mt-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Wallet</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your balance and view transaction history.</p>
        </div>
        <button className="bg-[#6200EE] hover:bg-[#4B00D1] text-white px-4 py-2 rounded-lg flex items-center gap-2 self-start sm:self-auto transition-colors">
          <CreditCard className="w-4 h-4" />
          Withdraw
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#1F1F1F] rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-cyan-400">
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">From {confirmedTickets.length} confirmed orders</p>
        </div>
        <div className="bg-[#1F1F1F] rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-1">Pending Balance</p>
          <p className="text-3xl font-bold text-yellow-400">
            ${pendingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            From {tickets.filter((t) => t.status === "pending").length} pending orders
          </p>
        </div>
      </div>

      {/* Summary Row */}
      <div className="flex items-center gap-2 mb-6 text-sm text-[#B0B0B0]">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        <span>
          Total of{" "}
          <span className="text-white font-semibold">{tickets.length}</span> ticket purchases across all events
        </span>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-md font-semibold text-gray-300 mb-4">Transaction History</h2>

        {tickets.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No transactions yet.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto mb-10">
              <table className="w-full border border-gray-700 text-sm rounded-lg overflow-hidden">
                <thead className="bg-gray-700 text-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Event</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Tickets</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-[#1A1A1A] divide-y divide-gray-800">
                  {tickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-[#222] transition-colors">
                      <td className="px-4 py-3 text-gray-300 font-medium">{ticket.name}</td>
                      <td className="px-4 py-3 text-gray-400 max-w-[160px] truncate">{ticket.event_title}</td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(ticket.timestamp || ticket.date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-center">{ticket.quantity}</td>
                      <td className="px-4 py-3 text-right font-semibold text-white">
                        ${ticket.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full inline-block ${
                            ticket.status === "confirmed"
                              ? "bg-emerald-900/40 text-emerald-400 border border-emerald-700"
                              : ticket.status === "pending"
                              ? "bg-yellow-900/40 text-yellow-400 border border-yellow-700"
                              : "bg-red-900/40 text-red-400 border border-red-700"
                          }`}
                        >
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket._id} className="p-4 rounded-xl border border-gray-700 bg-[#1F1F1F]">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-white font-medium">{ticket.name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[180px]">{ticket.event_title}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        ticket.status === "confirmed"
                          ? "bg-emerald-900/40 text-emerald-400"
                          : ticket.status === "pending"
                          ? "bg-yellow-900/40 text-yellow-400"
                          : "bg-red-900/40 text-red-400"
                      }`}
                    >
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Date</p>
                      <p className="text-gray-300">
                        {new Date(ticket.timestamp || ticket.date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Tickets</p>
                      <p className="text-gray-300">{ticket.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Amount</p>
                      <p className="text-white font-semibold">
                        ${ticket.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Wallet;
