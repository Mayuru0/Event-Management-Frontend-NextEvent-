"use client";

import { useState } from "react";
import { Ticket, Calendar, MapPin, ChevronLeft, ChevronRight, DollarSign, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";
import { useGetTicketsUserIdQuery, useDeleteTicketMutation } from "@/Redux/features/ticketApiSlice";
import Swal from "sweetalert2";

const statusConfig = {
  confirmed: {
    label: "Confirmed",
    classes: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  pending: {
    label: "Pending",
    classes: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    dot: "bg-amber-400",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-red-500/10 text-red-400 border border-red-500/20",
    dot: "bg-red-400",
  },
};

function MyTickets() {
  const user = useSelector(selectuser);
  const UserId = user?._id;

  const { data: tickets = [], isLoading, isError } = useGetTicketsUserIdQuery(UserId as string, { skip: !UserId });
  const [deleteTicket] = useDeleteTicketMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "cancelled">("all");
  const itemsPerPage = 5;

  const filtered = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const handleCancel = async (ticketId: string) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "This will cancel your ticket. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "Keep It",
      background: "#1A1A1A",
      color: "#fff",
      confirmButtonColor: "#CF6679",
      cancelButtonColor: "#6200EE",
    });

    if (result.isConfirmed) {
      try {
        await deleteTicket(ticketId).unwrap();
        Swal.fire({
          title: "Cancelled",
          text: "Your ticket has been cancelled.",
          icon: "success",
          background: "#1A1A1A",
          color: "#fff",
          confirmButtonColor: "#6200EE",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire({
          title: "Error",
          text: "Failed to cancel ticket. Please try again.",
          icon: "error",
          background: "#1A1A1A",
          color: "#fff",
          confirmButtonColor: "#6200EE",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#1A1A1A] rounded-3xl md:rounded-r-3xl md:mt-28 overflow-hidden animate-pulse">
        <div className="h-44 bg-[#242424]" />
        <div className="p-8 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#1A1A1A] rounded-3xl md:rounded-r-3xl md:mt-28 overflow-hidden">
        <div className="p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-400 font-medium">Failed to load tickets. Please try again.</p>
        </div>
      </div>
    );
  }

  // Summary stats
  const confirmed = tickets.filter((t) => t.status === "confirmed").length;
  const pending = tickets.filter((t) => t.status === "pending").length;
  const totalSpent = tickets
    .filter((t) => t.status === "confirmed")
    .reduce((sum, t) => sum + t.totalPrice, 0);

  return (
    <div className="bg-[#1A1A1A] rounded-3xl md:rounded-r-3xl md:mt-28">
      {/* Hero Banner */}
      <div className="relative h-40 rounded-t-3xl md:rounded-tr-3xl overflow-hidden bg-gradient-to-br from-[#00897B] via-[#00695C] to-[#1C1C2E]">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#03DAC6]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 left-12 w-40 h-40 rounded-full bg-[#03DAC6]/8 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />
        <div className="absolute inset-0 flex items-center px-6 md:px-8">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Ticket className="w-5 h-5 text-[#03DAC6]" />
              <h2 className="text-xl font-bold text-white">My Tickets</h2>
            </div>
            <p className="text-[#03DAC6]/70 text-sm">Manage your event bookings</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-[#1F1F1F] border border-white/5 text-center">
            <p className="text-2xl font-bold text-white">{tickets.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-center">
            <p className="text-2xl font-bold text-emerald-400">{confirmed}</p>
            <p className="text-xs text-gray-500 mt-0.5">Confirmed</p>
          </div>
          <div className="p-3 rounded-xl bg-[#03DAC6]/8 border border-[#03DAC6]/15 text-center">
            <p className="text-2xl font-bold text-[#03DAC6]">${totalSpent.toFixed(0)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Spent</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {(["all", "confirmed", "pending", "cancelled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setFilter(tab); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? "bg-[#6200EE] text-white"
                  : "bg-[#242424] text-gray-500 hover:text-white border border-white/5"
              }`}
            >
              {tab === "all" ? `All (${tickets.length})` : `${tab.charAt(0).toUpperCase() + tab.slice(1)} (${tickets.filter(t => t.status === tab).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-600">
            <Ticket className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-base font-medium text-gray-500">
              {filter === "all" ? "No tickets yet" : `No ${filter} tickets`}
            </p>
            <p className="text-sm mt-1 text-gray-600">
              {filter === "all"
                ? "Your purchased tickets will appear here."
                : "Try a different filter."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#242424] text-gray-500 text-left text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 font-semibold rounded-tl-xl">Event</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold text-center">Qty</th>
                    <th className="px-4 py-3 font-semibold text-right">Total</th>
                    <th className="px-4 py-3 font-semibold text-center">Status</th>
                    <th className="px-4 py-3 font-semibold text-center rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginated.map((ticket) => {
                    const sc = statusConfig[ticket.status as keyof typeof statusConfig] ?? statusConfig.pending;
                    return (
                      <tr key={ticket._id} className="hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3.5 text-white font-medium max-w-[200px]">
                          <span className="truncate block">{ticket.event_title}</span>
                          <span className="text-xs text-gray-600">{ticket.event_type}</span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-600" />
                            {new Date(ticket.date).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-600" />
                            <span className="truncate max-w-[130px] block">{ticket.location}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="bg-[#6200EE]/15 text-[#03DAC6] border border-[#6200EE]/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                            {ticket.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="font-semibold text-white flex items-center justify-end gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                            {ticket.totalPrice.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.classes}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {ticket.status === "pending" && (
                            <button
                              onClick={() => handleCancel(ticket._id)}
                              className="text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2.5 py-1 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                            >
                              Cancel
                            </button>
                          )}
                          {ticket.status === "confirmed" && (
                            <span className="text-xs text-gray-600">—</span>
                          )}
                          {ticket.status === "cancelled" && (
                            <span className="text-xs text-gray-600">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {paginated.map((ticket) => {
                const sc = statusConfig[ticket.status as keyof typeof statusConfig] ?? statusConfig.pending;
                return (
                  <div
                    key={ticket._id}
                    className="p-4 rounded-xl border border-white/8 bg-[#1F1F1F] hover:border-white/12 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm leading-snug truncate">{ticket.event_title}</h3>
                        <p className="text-xs text-gray-600 mt-0.5">{ticket.event_type}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${sc.classes}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-gray-600 shrink-0" />
                        {new Date(ticket.date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-gray-600 shrink-0" />
                        <span className="truncate">{ticket.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Ticket className="w-3 h-3 text-gray-600 shrink-0" />
                        {ticket.quantity} ticket{ticket.quantity > 1 ? "s" : ""}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3 h-3 text-gray-600 shrink-0" />
                        <span className="text-white font-semibold">${ticket.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    {ticket.status === "pending" && (
                      <button
                        onClick={() => handleCancel(ticket._id)}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/15 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                <p className="text-xs text-gray-600">
                  {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#242424] hover:bg-[#2a2a2a] text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                        currentPage === i + 1
                          ? "bg-[#6200EE] text-white"
                          : "bg-[#242424] hover:bg-[#2a2a2a] text-gray-400"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#242424] hover:bg-[#2a2a2a] text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MyTickets;
