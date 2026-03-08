"use client";

import { useState } from "react";
import Image from "next/image";
import { useGetTicketsorganizerIdQuery } from "@/Redux/features/ticketApiSlice";
import { useGetEventsByOrganizeridQuery } from "@/Redux/features/eventApiSlice";
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";
import { Users } from "lucide-react";

const OrganizerCustomer = () => {
  const user = useSelector(selectuser);
  const organizerid = user?._id as string;

  const { data: customers = [], isLoading, isError } = useGetTicketsorganizerIdQuery(organizerid, { skip: !organizerid });
  const { data: events = [] } = useGetEventsByOrganizeridQuery(organizerid, { skip: !organizerid });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const itemsPerPage = 8;

  // Filter customers by selected event
  const filteredCustomers = selectedEvent === "all"
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-emerald-900/40 text-emerald-400 border border-emerald-700";
      case "pending": return "bg-yellow-900/40 text-yellow-400 border border-yellow-700";
      case "cancelled": return "bg-red-900/40 text-red-400 border border-red-700";
      default: return "bg-gray-700 text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#1F1F1F] min-h-[700px] rounded-3xl md:rounded-r-3xl mt-28 flex items-center justify-center">
        <p className="text-white text-xl font-semibold animate-pulse">Loading customers...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#1F1F1F] min-h-[700px] rounded-3xl md:rounded-r-3xl mt-28 flex items-center justify-center">
        <p className="text-red-500 text-lg font-semibold">Failed to load customers.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1F1F1F] min-h-[700px] rounded-3xl md:rounded-r-3xl mt-28 text-white flex justify-center py-8">
      <div className="w-full max-w-5xl px-4 md:px-6 py-6 md:py-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Customers
            </h2>
            <p className="text-gray-400 text-sm mt-1">View attendee list for each event effortlessly.</p>
            <p className="text-[#B0B0B0] text-xs mt-1">
              Showing{" "}
              <span className="text-white font-semibold">{filteredCustomers.length}</span>{" "}
              {selectedEvent === "all" ? "total" : "filtered"} orders
            </p>
          </div>

          {/* Event Filter */}
          <select
            value={selectedEvent}
            onChange={handleEventFilter}
            className="bg-[#2C2C2C] text-white p-2 rounded-lg border border-gray-600 w-full sm:w-64 text-sm focus:ring-2 focus:ring-[#6200EE] outline-none"
          >
            <option value="all">All Events</option>
            {events.map((event) => (
              <option key={event._id} value={event.title}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        {paginatedCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Users className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg">No customers found</p>
            <p className="text-sm mt-1">
              {selectedEvent !== "all" ? "Try selecting a different event." : "No ticket purchases yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-700 text-gray-200 text-left">
                    <th className="p-3 rounded-tl-lg">Customer</th>
                    <th className="p-3">Event</th>
                    <th className="p-3">Purchase Date</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3 text-center rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.map((customer, index) => (
                    <tr
                      key={customer._id || index}
                      className="bg-[#1F1F1F] border-b border-gray-700 hover:bg-[#252525] transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Image
                            src={customer.profilePic || "/default-profile.png"}
                            alt="Avatar"
                            width={32}
                            height={32}
                            className="rounded-full object-cover w-8 h-8"
                          />
                          <span className="font-medium text-white">{customer.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-400 max-w-[160px]">
                        <span className="truncate block">{customer.event_title}</span>
                      </td>
                      <td className="p-3 text-gray-400">
                        {new Date(customer.timestamp || customer.date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </td>
                      <td className="p-3 text-gray-400 text-sm">{customer.event_type}</td>
                      <td className="p-3 text-center text-white font-medium">{customer.quantity}</td>
                      <td className="p-3 text-right text-white font-semibold">
                        ${customer.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(customer.status)}`}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {paginatedCustomers.map((customer, index) => (
                <div key={customer._id || index} className="p-4 rounded-xl border border-gray-700 bg-[#2A2A2A]">
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      src={customer.profilePic || "/default-profile.png"}
                      alt="Avatar"
                      width={40}
                      height={40}
                      className="rounded-full object-cover w-10 h-10"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white">{customer.name}</h3>
                      <p className="text-xs text-gray-400 truncate">{customer.event_title}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(customer.status)}`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Purchase Date</p>
                      <p className="text-gray-300">
                        {new Date(customer.timestamp || customer.date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Type</p>
                      <p className="text-gray-300">{customer.event_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Tickets</p>
                      <p className="text-gray-300 font-medium">{customer.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="text-white font-semibold">
                        ${customer.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
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
                Prev
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
  );
};

export default OrganizerCustomer;
