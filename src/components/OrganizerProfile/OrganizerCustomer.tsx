"use client"

import { useState } from "react"
import Image from "next/image"
import { useGetTicketsorganizerIdQuery } from "@/Redux/features/ticketApiSlice"
import { useSelector } from "react-redux"
import { selectuser } from "@/Redux/features/authSlice"

const OrganizerCustomer = () => {
  const user = useSelector(selectuser)
  const organizerid = user?._id

  const { data: customers = [], isLoading, isError } = useGetTicketsorganizerIdQuery(organizerid as string)

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8 // Number of items per page

  // Calculate total number of pages
  const totalPages = Math.ceil(customers.length / itemsPerPage)

  // Get the customers to display for the current page
  const paginatedCustomers = customers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (isLoading) {
    return <p className="text-center text-xl font-semibold text-white relative mt-[20%]">Loading customer...</p>
  }

  if (isError) {
    return <p className="text-center text-red-500 text-lg font-semibold">Failed to load customer.</p>
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="bg-[#1F1F1F] min-h-[700px] rounded-3xl md:rounded-r-3xl mt-28 text-white flex justify-center py-8">
      <div className="w-full max-w-5xl px-4 md:px-6 py-6 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">Customers</h2>
            <p className="text-gray-400 text-sm">View attendee list for each event effortlessly.</p>
          </div>
          <select className="bg-gray-800 text-white p-2 rounded-md border border-gray-600 w-full sm:w-auto mt-2 sm:mt-0">
            <option>ArtFusion</option>
            <option>Other Event</option>
          </select>
        </div>

        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-400 text-black text-left">
                <th className="p-3">Username</th>
                <th className="p-3">Event</th>
                <th className="p-3">Purchased Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Tickets Count</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer, index) => (
                <tr key={index} className="bg-[#1F1F1F] border-b border-gray-700">
                  {/* Username with Avatar */}
                  <td className="p-3 flex items-center gap-2">
                    <Image
                      src={customer.profilePic || "/placeholder.svg"}
                      alt="Avatar"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    {customer.name}
                  </td>
                  <td className="p-3">{customer.event_title}</td>
                  <td className="p-3">{new Date(customer.date || "Unknown Date").toLocaleDateString()}</td>
                  <td className="p-3">{customer.event_type}</td>
                  <td className="p-3">{customer.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout - Shown only on mobile */}
        <div className="md:hidden space-y-4">
          {paginatedCustomers.map((customer, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-700 bg-[#2A2A2A]">
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src={customer.profilePic || "/placeholder.svg"}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-medium">{customer.name}</h3>
                  <p className="text-sm text-gray-400">{customer.event_title}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Purchased Date</p>
                  <p>{new Date(customer.date || "Unknown Date").toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Type</p>
                  <p>{customer.event_type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Tickets Count</p>
                  <p>{customer.quantity}</p>
                </div>
              </div>
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
            <span className="hidden sm:flex text-white text-sm items-center px-3">
              {`Page ${currentPage} of ${totalPages}`}
            </span>

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

export default OrganizerCustomer

