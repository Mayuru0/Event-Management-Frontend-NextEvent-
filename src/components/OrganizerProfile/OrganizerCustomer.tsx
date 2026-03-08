"use client";

import { useState } from "react";
import Image from "next/image";
import { useGetTicketsorganizerIdQuery } from "@/Redux/features/ticketApiSlice";
import { useGetEventsByOrganizeridQuery } from "@/Redux/features/eventApiSlice";
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";
import {
  Users, ChevronLeft, ChevronRight, DollarSign,
  Calendar, Filter,
} from "lucide-react";

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

const OrganizerCustomer = () => {
  const user = useSelector(selectuser);
  const organizerid = user?._id as string;

  const { data: customers = [], isLoading, isError } = useGetTicketsorganizerIdQuery(organizerid, {
    skip: !organizerid,
  });
  const { data: events = [] } = useGetEventsByOrganizeridQuery(organizerid, { skip: !organizerid });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const itemsPerPage = 8;

  const filteredCustomers =
    selectedEvent === "all"
      ? customers
      : customers.filter((c) => c.event_title === selectedEvent);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const handleEventFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEvent(e.target.value);
    setCurrentPage(1);
  };

  // Summary stats
  const confirmed = customers.filter((c) => c.status === "confirmed").length;
  const totalRevenue = customers
    .filter((c) => c.status === "confirmed")
    .reduce((sum, c) => sum + c.totalPrice, 0);

  if (isLoading) {
    return (
      <div className="bg-[#1A1A1A] rounded-3xl md:rounded-r-3xl mt-28 overflow-hidden animate-pulse">
        <div className="h-40 bg-[#242424]" />
        <div className="p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#1A1A1A] rounded-3xl md:rounded-r-3xl mt-28 flex items-center justify-center min-h-[400px]">
        <p className="text-red-400 text-sm font-medium">Failed to load customers.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-3xl md:rounded-r-3xl mt-28">
      {/* Hero Banner */}
      <div className="relative h-40 rounded-t-3xl md:rounded-tr-3xl overflow-hidden bg-gradient-to-br from-[#6200EE] via-[#4500B5] to-[#1C0030]">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#00FFC2]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 left-12 w-40 h-40 rounded-full bg-[#00FFC2]/8 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />
        <div className="absolute inset-0 flex items-center px-6 md:px-8">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Users className="w-5 h-5 text-[#00FFC2]" />
              <h2 className="text-xl font-bold text-white">Customers</h2>
            </div>
            <p className="text-[#00FFC2]/70 text-sm">View attendee list for each event</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-[#1F1F1F] border border-white/5 text-center">
            <p className="text-2xl font-bold text-white">{customers.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Orders</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-center">
            <p className="text-2xl font-bold text-emerald-400">{confirmed}</p>
            <p className="text-xs text-gray-500 mt-0.5">Confirmed</p>
          </div>
          <div className="p-3 rounded-xl bg-[#00FFC2]/8 border border-[#00FFC2]/15 text-center">
            <p className="text-xl font-bold text-[#00FFC2]">${totalRevenue.toFixed(0)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Revenue</p>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-medium">Filter by event:</span>
          </div>
          <select
            value={selectedEvent}
            onChange={handleEventFilter}
            className="bg-[#242424] text-white px-3 py-2 rounded-lg border border-white/8 text-xs font-medium focus:ring-2 focus:ring-[#6200EE]/30 focus:border-[#6200EE]/50 outline-none transition-all"
          >
            <option value="all">All Events ({customers.length})</option>
            {events.map((event) => (
              <option key={event._id} value={event.title}>
                {event.title} ({customers.filter((c) => c.event_title === event.title).length})
              </option>
            ))}
          </select>
          {selectedEvent !== "all" && (
            <button
              onClick={() => setSelectedEvent("all")}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Clear filter
            </button>
          )}
          <div className="ml-auto">
            <span className="text-xs text-gray-600">
              Showing <span className="text-white font-semibold">{filteredCustomers.length}</span>{" "}
              {selectedEvent === "all" ? "total" : "filtered"} records
            </span>
          </div>
        </div>

        {paginatedCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-600">
            <Users className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-base font-medium text-gray-500">No customers found</p>
            <p className="text-sm mt-1 text-gray-600">
              {selectedEvent !== "all"
                ? "Try selecting a different event."
                : "No ticket purchases yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#242424] text-gray-500 text-left text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 font-semibold rounded-tl-xl">Customer</th>
                    <th className="px-4 py-3 font-semibold">Event</th>
                    <th className="px-4 py-3 font-semibold">Purchase Date</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold text-center">Qty</th>
                    <th className="px-4 py-3 font-semibold text-right">Total</th>
                    <th className="px-4 py-3 font-semibold text-center rounded-tr-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedCustomers.map((customer, index) => {
                    const sc =
                      statusConfig[customer.status as keyof typeof statusConfig] ??
                      statusConfig.pending;
                    return (
                      <tr
                        key={customer._id || index}
                        className="hover:bg-white/2 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/10">
                              <Image
                                src={customer.profilePic || "/default-profile.png"}
                                alt={customer.name}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <span className="font-medium text-white">{customer.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-400 max-w-[160px]">
                          <span className="truncate block">{customer.event_title}</span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-600" />
                            {new Date(customer.timestamp || customer.date).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 text-xs">{customer.event_type}</td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="bg-[#6200EE]/15 text-[#00FFC2] border border-[#6200EE]/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                            {customer.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="font-semibold text-white flex items-center justify-end gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                            {customer.totalPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.classes}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {sc.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {paginatedCustomers.map((customer, index) => {
                const sc =
                  statusConfig[customer.status as keyof typeof statusConfig] ??
                  statusConfig.pending;
                return (
                  <div
                    key={customer._id || index}
                    className="p-4 rounded-xl border border-white/8 bg-[#1F1F1F]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/10">
                        <Image
                          src={customer.profilePic || "/default-profile.png"}
                          alt={customer.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm">{customer.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{customer.event_title}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${sc.classes}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-600 mb-0.5">Purchase Date</p>
                        <p className="text-gray-300">
                          {new Date(customer.timestamp || customer.date).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-0.5">Type</p>
                        <p className="text-gray-300">{customer.event_type}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-0.5">Tickets</p>
                        <p className="text-gray-300 font-medium">{customer.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-0.5">Total</p>
                        <p className="text-white font-bold">
                          ${customer.totalPrice.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
            <p className="text-xs text-gray-600">
              {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#242424] hover:bg-[#2a2a2a] text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                      currentPage === page
                        ? "bg-[#6200EE] text-white"
                        : "bg-[#242424] hover:bg-[#2a2a2a] text-gray-400"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
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
      </div>
    </div>
  );
};

export default OrganizerCustomer;
