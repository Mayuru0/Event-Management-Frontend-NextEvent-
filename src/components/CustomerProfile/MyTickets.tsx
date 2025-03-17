"use client"

import { useState } from "react"
import { CircleArrowDownIcon as CircleDown } from "lucide-react"
import { useSelector } from "react-redux"
import { selectuser } from "@/Redux/features/authSlice"
import { useGetTicketsUserIdQuery } from "@/Redux/features/ticketApiSlice"

function MyTickets() {
  const user = useSelector(selectuser)
  const UserId = user?._id

  const { data: tickets = [], isLoading, isError } = useGetTicketsUserIdQuery(UserId as string)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3 // Number of items per page

  // Calculate total number of pages
  const totalPages = Math.ceil(tickets.length / itemsPerPage)

  // Get the tickets to display for the current page
  const paginatedTickets = tickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (isLoading) {
    return <p className="text-center text-xl font-semibold text-white relative -mt-[20%]">Loading Ticket...</p>
  }

  if (isError) {
    return <p className="text-center text-red-500 text-lg font-semibold">Failed to load Ticket.</p>
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="bg-[#1F1F1F]  rounded-3xl md:rounded-r-3xl md:mt-28 text-white flex justify-center py-8">
      <div className="w-full max-w-4xl px-4 md:px-6 py-6 md:py-12">
        <h2 className="text-lg font-semibold mb-2">My Tickets</h2>
        <p className="text-gray-400 mb-4 text-sm">Download your tickets and view purchase history.</p>

        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-400 text-black text-left">
                <th className="p-2">Title</th>
                <th className="p-1">Date</th>
                <th className="p-1">Location</th>
                <th className="p-1">Tickets</th>
                <th className="p-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.map((ticket, index) => (
                <tr key={index} className="bg-[#1F1F1F] border-b border-gray-600">
                  <td className="p-2">{ticket.event_title}</td>
                  <td className="p-1">{new Date(ticket.date || "Unknown Date").toLocaleDateString()}</td>
                  <td className="p-1">{ticket.location}</td>
                  <td className="p-1">{ticket.quantity}</td>
                  <td className="p-1">
                    <button className="flex items-center bg-teal-400 text-black px-1 py-0.5 text-xs rounded-lg">
                      Download <CircleDown className="ml-1 w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout - Shown only on mobile */}
        <div className="md:hidden space-y-4">
          {paginatedTickets.map((ticket, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-700 bg-[#2A2A2A]">
              <h3 className="font-medium text-base mb-2">{ticket.event_title}</h3>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mb-3">
                <div>
                  <p className="text-xs text-gray-400">Date</p>
                  <p>{new Date(ticket.date || "Unknown Date").toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p>{ticket.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Tickets</p>
                  <p>{ticket.quantity}</p>
                </div>
              </div>

              <button className="flex items-center bg-teal-400 text-black px-3 py-1 rounded-lg text-sm">
                Download <CircleDown className="ml-2 w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Controls - Enhanced for Mobile */}
        <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-3">
          {/* Page indicator for mobile */}
          <div className="text-white text-sm bg-[#2A2A2A] px-3 py-1 rounded-full mb-3 sm:hidden">
            {`Page ${currentPage} of ${totalPages}`}
          </div>

          <div className="flex gap-3">
            <button
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:bg-gray-900 min-w-[80px] touch-manipulation"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {/* Page indicator for tablet/desktop */}
            <span className="hidden sm:flex text-white text-sm items-center px-3">{`Page ${currentPage} of ${totalPages}`}</span>

            <button
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:bg-gray-900 min-w-[80px] touch-manipulation"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyTickets

