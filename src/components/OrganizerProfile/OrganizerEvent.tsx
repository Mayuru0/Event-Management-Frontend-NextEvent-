"use client";

import type React from "react";
import { useState } from "react";
import NewEventSideBar from "./sidePanel/eventCreationSidePanel";
import { useGetEventsByOrganizeridQuery } from "@/Redux/features/eventApiSlice";
import type { Event } from "@/type/EventType";
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";
import { Eye, Plus, CalendarDays, MapPin } from "lucide-react";

interface OrganizerEventsProps {
  onView: (event: Event) => void;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Published": return "bg-teal-600/20 text-teal-400 border border-teal-700";
    case "Pending": return "bg-yellow-500/20 text-yellow-400 border border-yellow-600";
    case "Archived": return "bg-gray-600/20 text-gray-400 border border-gray-600";
    case "Rejected": return "bg-red-600/20 text-red-400 border border-red-700";
    default: return "bg-gray-700 text-gray-300";
  }
};

const OrganizerEvents: React.FC<OrganizerEventsProps> = ({ onView }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const user = useSelector(selectuser);
  const organizerid = user?._id as string;

  const { data: events = [], isLoading, isError } = useGetEventsByOrganizeridQuery(organizerid, {
    skip: !organizerid,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredEvents = statusFilter === "all"
    ? events
    : events.filter((e) => e.status === statusFilter);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="bg-[#1F1F1F] rounded-3xl md:rounded-r-3xl mt-28 flex items-center justify-center min-h-[400px]">
        <p className="text-white text-xl font-semibold animate-pulse">Loading events...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#1F1F1F] rounded-3xl md:rounded-r-3xl mt-28 flex items-center justify-center min-h-[400px]">
        <p className="text-red-500 text-lg font-semibold">Failed to load events.</p>
      </div>
    );
  }

  return (
    <div className="">
      {/* Creation Side Panel */}
      {isSidebarOpen && <NewEventSideBar onClose={() => setSidebarOpen(false)} />}

      <div className="bg-[#1F1F1F] rounded-3xl md:rounded-r-3xl mt-28 text-white flex justify-center py-8 min-h-screen">
        <div className="w-full max-w-4xl px-4 md:px-6 py-6 md:py-12">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Events</h1>
              <p className="text-gray-400 text-sm">Create, update, and track your events effortlessly.</p>
              <p className="text-[#B0B0B0] text-xs mt-1">
                <span className="text-white font-semibold">{filteredEvents.length}</span> events
                {statusFilter !== "all" && ` with status "${statusFilter}"`}
              </p>
            </div>
            <div className="flex gap-3 self-start sm:self-auto flex-wrap">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="bg-[#2C2C2C] text-white px-3 py-2 rounded-lg border border-gray-600 text-sm focus:ring-2 focus:ring-[#6200EE] outline-none"
              >
                <option value="all">All Status</option>
                <option value="Published">Published</option>
                <option value="Pending">Pending</option>
                <option value="Archived">Archived</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button
                className="bg-[#6200EE] hover:bg-[#4B00D1] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Plus className="w-4 h-4" />
                New Event
              </button>
            </div>
          </div>

          {currentEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <CalendarDays className="w-12 h-12 mb-4 opacity-30" />
              <p className="text-lg">No events found</p>
              <p className="text-sm mt-1">
                {statusFilter !== "all"
                  ? "Try selecting a different status filter."
                  : "Click \"New Event\" to create your first event."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-700 text-gray-200 text-left">
                      <th className="p-3 rounded-tl-lg">Title</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Location</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Capacity</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-center rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEvents.map((event: Event) => (
                      <tr
                        key={event._id}
                        className="border-b border-gray-700 text-gray-300 hover:bg-[#252525] transition-colors"
                      >
                        <td className="p-3 text-white font-medium max-w-[160px]">
                          <span className="truncate block">{event.title}</span>
                        </td>
                        <td className="p-3 text-gray-400">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="p-3 text-gray-400">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-500" />
                            <span className="truncate max-w-[120px] block">{event.location}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(String(event.status))}`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="p-3 text-center text-gray-300">{event.quantity}</td>
                        <td className="p-3 text-right text-cyan-400 font-semibold">${event.ticket_price}</td>
                        <td className="p-3">
                          <button
                            className="flex items-center gap-1 bg-[#6200EE]/20 hover:bg-[#6200EE]/40 text-[#6200EE] border border-[#6200EE]/40 px-3 py-1.5 text-xs rounded-lg mx-auto transition-colors"
                            onClick={() => onView(event)}
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {currentEvents.map((event: Event) => (
                  <div key={event._id} className="p-4 rounded-xl border border-gray-700 bg-[#2A2A2A]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{event.title}</h3>
                        <p className="text-xs text-gray-400">{event.event_type}</p>
                      </div>
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full font-semibold shrink-0 ${getStatusStyle(String(event.status))}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-300 mb-4">
                      <div>
                        <p className="text-xs text-gray-400">Date</p>
                        <p>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="truncate">{event.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Capacity</p>
                        <p>{event.quantity} tickets</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Price</p>
                        <p className="text-cyan-400 font-semibold">${event.ticket_price}</p>
                      </div>
                    </div>
                    <button
                      className="flex items-center justify-center gap-2 bg-[#6200EE]/20 hover:bg-[#6200EE]/40 text-[#6200EE] border border-[#6200EE]/40 px-4 py-2 text-sm rounded-lg w-full transition-colors"
                      onClick={() => onView(event)}
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-3">
              <div className="text-white text-sm bg-[#2A2A2A] px-3 py-1 rounded-full sm:hidden">
                {`Page ${currentPage} of ${totalPages}`}
              </div>
              <div className="flex gap-3">
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-40 min-w-[80px] transition-colors"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="hidden sm:flex text-white text-sm items-center px-3">
                  {`Page ${currentPage} of ${totalPages}`}
                </span>
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-40 min-w-[80px] transition-colors"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerEvents;
