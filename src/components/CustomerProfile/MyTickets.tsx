"use client";

import { useState } from "react";
import { Download, Ticket, Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";
import { useGetTicketsUserIdQuery } from "@/Redux/features/ticketApiSlice";

function MyTickets() {
  const user = useSelector(selectuser);
  const UserId = user?._id;

  const { data: tickets = [], isLoading, isError } = useGetTicketsUserIdQuery(UserId as string);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(tickets.length / itemsPerPage);
  const paginatedTickets = tickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="bg-[#1A1A1A] rounded-3xl md:rounded-r-3xl md:mt-28 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[#6200EE] via-[#03DAC6] to-[#6200EE]" />
        <div className="p-8 animate-pulse space-y-4">
          <div className="h-6 bg-white/5 rounded w-1/4" />
          <div className="h-4 bg-white/5 rounded w-1/3" />
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
        <div className="h-1.5 bg-gradient-to-r from-[#6200EE] via-[#03DAC6] to-[#6200EE]" />
        <div className="p-8 text-center">
          <p className="text-red-400 font-medium">Failed to load tickets. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-3xl md:rounded-r-3xl md:mt-28 overflow-hidden">
      {/* Top gradient bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#6200EE] via-[#03DAC6] to-[#6200EE]" />

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Ticket className="w-5 h-5 text-[#03DAC6]" />
              <h2 className="text-2xl font-bold text-white tracking-tight">My Tickets</h2>
            </div>
            <p className="text-gray-500 text-sm">Download your tickets and view purchase history.</p>
          </div>
          <div className="bg-[#03DAC6]/10 border border-[#03DAC6]/20 px-3 py-1.5 rounded-lg">
            <span className="text-[#03DAC6] text-sm font-semibold">{tickets.length} total</span>
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-600">
            <Ticket className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-500">No tickets yet</p>
            <p className="text-sm mt-1">Your purchased tickets will appear here.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#242424] text-gray-400 text-left">
                    <th className="px-4 py-3 font-medium rounded-tl-xl">Event</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium text-center">Qty</th>
                    <th className="px-4 py-3 font-medium text-center rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedTickets.map((ticket, index) => (
                    <tr key={index} className="hover:bg-white/3 transition-colors group">
                      <td className="px-4 py-3.5 text-white font-medium">{ticket.event_title}</td>
                      <td className="px-4 py-3.5 text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-600" />
                          {new Date(ticket.date || "").toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-600" />
                          <span className="truncate max-w-[140px] block">{ticket.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="bg-[#6200EE]/15 text-[#03DAC6] border border-[#6200EE]/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                          {ticket.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button className="inline-flex items-center gap-1.5 bg-[#03DAC6]/15 hover:bg-[#03DAC6]/25 text-[#03DAC6] border border-[#03DAC6]/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {paginatedTickets.map((ticket, index) => (
                <div key={index} className="p-4 rounded-xl border border-white/8 bg-[#202020] hover:border-white/12 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-white text-sm leading-snug flex-1 mr-2">{ticket.event_title}</h3>
                    <span className="bg-[#6200EE]/15 text-[#03DAC6] border border-[#6200EE]/20 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0">
                      {ticket.quantity} tickets
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                      {new Date(ticket.date || "").toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                      <span className="truncate">{ticket.location}</span>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 bg-[#03DAC6]/15 hover:bg-[#03DAC6]/25 text-[#03DAC6] border border-[#03DAC6]/20 px-3 py-2 rounded-lg text-xs font-semibold transition-all">
                    <Download className="w-3.5 h-3.5" />
                    Download Ticket
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                <p className="text-xs text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, tickets.length)} of {tickets.length}
                </p>
                <div className="flex items-center gap-2">
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
