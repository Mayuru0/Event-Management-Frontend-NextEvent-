"use client"

import type React from "react"
import { useState } from "react"
import NewEventSideBar from "./sidePanel/eventCreationSidePanel"
import { useGetEventsByOrganizeridQuery } from "@/Redux/features/eventApiSlice"
import type { Event } from "@/type/EventType"
import { useSelector } from "react-redux"
import { selectuser } from "@/Redux/features/authSlice"
import { Eye } from "lucide-react"

interface OrganizerEventsProps {
  onView: (events: Event) => void
}

const OrganizerEvents: React.FC<OrganizerEventsProps> = ({ onView }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const user = useSelector(selectuser)
  const organizerid = user?._id

  const { data: events = [], isLoading, isError } = useGetEventsByOrganizeridQuery(organizerid as string)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Number of items per page

  // Handle pagination: get the events to display based on the current page
  const indexOfLastEvent = currentPage * itemsPerPage
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent)

  // Calculate total pages
  const totalPages = Math.ceil(events.length / itemsPerPage)

  const handleNewEventClick = () => {
    setSidebarOpen(true) // Open the sidebar when the button is clicked
  }

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 text-black"
      case "Published":
        return "bg-teal-600 text-white"
      case "Archived":
        return "bg-gray-600 text-white"
      case "Rejected":
        return "bg-red-600 text-white"
      default:
        return "bg-gray-300 text-black"
    }
  }

  if (isLoading) {
    return <p className="text-center text-xl font-semibold text-white relative mt-[20%]">Loading events...</p>
  }

  if (isError) {
    return <p className="text-center text-red-500 text-lg font-semibold mt-[20%]">Failed to load events.</p>
  }

  return (
    <div className="">
      {/* Sidebar */}
      {isSidebarOpen && <NewEventSideBar onClose={() => setSidebarOpen(false)} />}

      <div className="bg-[#1F1F1F]  rounded-3xl md:rounded-r-3xl mt-28 text-white flex justify-center py-8">
        <div className="w-full max-w-4xl px-4 md:px-6 py-6 md:py-12">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Events</h1>
              <p className="text-gray-400">Create, update, and track your events effortlessly.</p>
            </div>
            <button
              className="bg-violet-700 text-white px-4 py-2 rounded-lg self-start sm:self-auto "
              onClick={handleNewEventClick}
            >
              New Event +
            </button>
          </div>

          {/* Desktop Table - Hidden on mobile */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse border border-neutral-400">
              <thead className="bg-neutral-400 text-black">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Remaining Tickets</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentEvents.map((event: Event) => (
                  <tr key={event._id} className="border-b border-neutral-400 text-neutral-400 text-center">
                    <td className="p-3">{event.title}</td>
                    <td className="p-3">{new Date(event.date || "Unknown Date").toLocaleDateString()}</td>
                    <td className="p-3">{event.location}</td>
                    <td>
                      <span className={`inline-block px-3 py-1 rounded-lg ${getStatusStyle(String(event.status))}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="p-3">{event.ticket_price}</td>
                    <td className="p-3">
                      <button
                        className="bg-teal-300 text-black px-4 py-1 text-sm rounded-md flex items-center justify-center mx-auto"
                        onClick={() => onView(event)}
                      >
                        View <Eye className="ml-1 w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout - Shown only on mobile */}
          <div className="md:hidden space-y-4">
            {currentEvents.map((event: Event) => (
              <div key={event._id} className="p-4 rounded-lg border border-neutral-700 bg-[#2A2A2A]">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-base">{event.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-lg ${getStatusStyle(String(event.status))}`}>
                    {event.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-gray-300 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p>{new Date(event.date || "Unknown Date").toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p>{event.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Remaining Tickets</p>
                    <p>{event.ticket_price}</p>
                  </div>
                </div>

                <button
                  className="bg-teal-300 text-black px-4 py-2 text-sm rounded-md w-full flex items-center justify-cente relative"
                  onClick={() => onView(event)}
                >
                  View Details <Eye className="ml-1 w-4 h-4" />
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
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:bg-gray-900 min-w-[80px] touch-manipulation"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {/* Page indicator for tablet/desktop */}
              <span className="hidden sm:flex text-white text-sm items-center px-3">
                {`Page ${currentPage} of ${totalPages}`}
              </span>

              <button
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:bg-gray-900 min-w-[80px] touch-manipulation"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizerEvents

