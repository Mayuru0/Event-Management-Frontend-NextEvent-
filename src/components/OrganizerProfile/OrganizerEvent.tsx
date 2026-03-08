"use client";

import type React from "react";
import { useState } from "react";
import NewEventSideBar from "./sidePanel/eventCreationSidePanel";
import { useGetEventsByOrganizeridQuery } from "@/Redux/features/eventApiSlice";
import type { Event } from "@/type/EventType";
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";
import {
  Eye, Plus, CalendarDays, MapPin, ChevronLeft, ChevronRight,
  Calendar, BarChart2, CheckCircle2,
} from "lucide-react";

interface OrganizerEventsProps {
  onView: (event: Event) => void;
}

const statusConfig: Record<string, { label: string; classes: string; dot: string }> = {
  Published: {
    label: "Published",
    classes: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
    dot: "bg-teal-400",
  },
  Pending: {
    label: "Pending",
    classes: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    dot: "bg-amber-400",
  },
  Archived: {
    label: "Archived",
    classes: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
    dot: "bg-gray-400",
  },
  Rejected: {
    label: "Rejected",
    classes: "bg-red-500/10 text-red-400 border border-red-500/20",
    dot: "bg-red-400",
  },
};

const OrganizerEvents: React.FC<OrganizerEventsProps> = ({ onView }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const user = useSelector(selectuser);
  const organizerid = user?._id as string;

  const { data: events = [], isLoading, isError } = useGetEventsByOrganizeridQuery(organizerid, {
    skip: !organizerid,
  });

  const filteredEvents =
    statusFilter === "all" ? events : events.filter((e) => e.status === statusFilter);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const published = events.filter((e) => e.status === "Published").length;
  const pending = events.filter((e) => e.status === "Pending").length;

  if (isLoading) {
    return (
      <div className="bg-[#1A1A1A] rounded-3xl md:rounded-r-3xl mt-28 overflow-hidden animate-pulse">
        <div className="h-40 bg-[#242424]" />
        <div className="p-8 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#1A1A1A] rounded-3xl md:rounded-r-3xl mt-28 flex items-center justify-center min-h-[400px]">
        <p className="text-red-400 text-sm font-medium">Failed to load events.</p>
      </div>
    );
  }

  return (
    <div>
      {isSidebarOpen && <NewEventSideBar onClose={() => setSidebarOpen(false)} />}

      <div className="bg-[#1A1A1A] rounded-3xl md:rounded-r-3xl mt-28">
        {/* Hero Banner */}
        <div className="relative h-40 rounded-t-3xl md:rounded-tr-3xl overflow-hidden bg-gradient-to-br from-[#6200EE] via-[#4500B5] to-[#1C0030]">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#00FFC2]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 left-12 w-40 h-40 rounded-full bg-[#00FFC2]/8 blur-3xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-6 md:px-8">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <Calendar className="w-5 h-5 text-[#00FFC2]" />
                <h2 className="text-xl font-bold text-white">My Events</h2>
              </div>
              <p className="text-[#00FFC2]/70 text-sm">Create, update, and track your events</p>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold border border-white/20 backdrop-blur-sm transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              New Event
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-[#1F1F1F] border border-white/5 text-center">
              <p className="text-2xl font-bold text-white">{events.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Total</p>
            </div>
            <div className="p-3 rounded-xl bg-teal-500/8 border border-teal-500/15 text-center">
              <p className="text-2xl font-bold text-teal-400">{published}</p>
              <p className="text-xs text-gray-500 mt-0.5">Published</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/15 text-center">
              <p className="text-2xl font-bold text-amber-400">{pending}</p>
              <p className="text-xs text-gray-500 mt-0.5">Pending</p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {(["all", "Published", "Pending", "Archived", "Rejected"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setStatusFilter(tab); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === tab
                    ? "bg-[#6200EE] text-white"
                    : "bg-[#242424] text-gray-500 hover:text-white border border-white/5"
                }`}
              >
                {tab === "all"
                  ? `All (${events.length})`
                  : `${tab} (${events.filter((e) => e.status === tab).length})`}
              </button>
            ))}
          </div>

          {currentEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-600">
              <CalendarDays className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-base font-medium text-gray-500">
                {statusFilter !== "all" ? `No ${statusFilter} events` : "No events yet"}
              </p>
              <p className="text-sm mt-1 text-gray-600">
                {statusFilter !== "all"
                  ? "Try a different filter."
                  : 'Click "New Event" to create your first event.'}
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
                      <th className="px-4 py-3 font-semibold text-center">Status</th>
                      <th className="px-4 py-3 font-semibold text-center">Capacity</th>
                      <th className="px-4 py-3 font-semibold text-right">Price</th>
                      <th className="px-4 py-3 font-semibold text-center rounded-tr-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {currentEvents.map((event: Event) => {
                      const sc = statusConfig[String(event.status)] ?? statusConfig["Pending"];
                      return (
                        <tr
                          key={event._id}
                          className="hover:bg-white/2 transition-colors group"
                        >
                          <td className="px-4 py-3.5 max-w-[180px]">
                            <p className="text-white font-medium truncate">{event.title}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{event.event_type}</p>
                          </td>
                          <td className="px-4 py-3.5 text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <CalendarDays className="w-3.5 h-3.5 text-gray-600" />
                              {new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-600" />
                              <span className="truncate max-w-[130px] block">{event.location}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.classes}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                              {sc.label}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center text-gray-400 font-medium">
                            {event.quantity}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <span className="font-bold text-[#00FFC2]">${event.ticket_price}</span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <button
                              onClick={() => onView(event)}
                              className="inline-flex items-center gap-1.5 bg-[#6200EE]/15 hover:bg-[#6200EE]/30 text-[#6200EE] border border-[#6200EE]/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {currentEvents.map((event: Event) => {
                  const sc = statusConfig[String(event.status)] ?? statusConfig["Pending"];
                  return (
                    <div
                      key={event._id}
                      className="p-4 rounded-xl border border-white/8 bg-[#1F1F1F] hover:border-white/12 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm truncate">{event.title}</h3>
                          <p className="text-xs text-gray-600 mt-0.5">{event.event_type}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${sc.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="w-3 h-3 text-gray-600 shrink-0" />
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-gray-600 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BarChart2 className="w-3 h-3 text-gray-600 shrink-0" />
                          {event.quantity} tickets
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-[#00FFC2] shrink-0" />
                          <span className="text-[#00FFC2] font-bold">${event.ticket_price}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onView(event)}
                        className="w-full flex items-center justify-center gap-2 bg-[#6200EE]/15 hover:bg-[#6200EE]/25 text-[#6200EE] border border-[#6200EE]/20 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                  <p className="text-xs text-gray-600">
                    {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length}
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
    </div>
  );
};

export default OrganizerEvents;
