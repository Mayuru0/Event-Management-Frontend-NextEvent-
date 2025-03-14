import React, { useState } from "react";
import NewEventSideBar from "./sidePanel/eventCreationSidePanel";
import { useGetEventsByOrganizeridQuery } from "@/Redux/features/eventApiSlice";
import { Event } from "@/type/EventType";
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";


interface OrganizerEventsProps {
  onView: (events: Event) => void;
}

const OrganizerEvents: React.FC<OrganizerEventsProps> = ({ onView }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector(selectuser)

 

  const organizerid = user?._id
  // State for controlling sidebar visibility
const { data: events = [], isLoading, isError } = useGetEventsByOrganizeridQuery(organizerid as string);
  


  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of items per page

  // Handle pagination: get the events to display based on the current page
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  // Calculate total pages
  const totalPages = Math.ceil(events.length / itemsPerPage);

  const handleNewEventClick = () => {
    setSidebarOpen(true); // Open the sidebar when the button is clicked
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 text-black px-3 py-2";
      case "Published":
        return "bg-teal-600 text-white  px-2 py-2";
      case "Archived":
        return "bg-gray-600 text-white  px-3 py-2";
      case "Rejected":
        return "bg-red-600 text-white  px-3 py-2 ";
      default:
        return "bg-gray-300 text-black  px-2 py-2";
    }
  };

 


  if (isLoading) {
    return (
      <p className="text-center text-xl font-semibold text-white relative mt-[20%] ">Loading events...</p>
    )
  }
  
  if (isError) {
    return (
      <p className="text-center text-red-500 text-lg font-semibold mt-[20%]">
        Failed to load events.
      </p>
    )
  }

  return (
    <div className="">
      
      {/* Sidebar */}
      {isSidebarOpen && (
        <NewEventSideBar onClose={() => setSidebarOpen(false)} />
      )}{" "}
      {/* Conditionally render sidebar */}
      <div className="bg-[#1F1F1F] h-[800px] rounded-r-3xl mt-28  text-white  flex justify-center py-8">
        <div className="w-full max-w-4xl py-12">
          {/* Header Row - Left Side Text / Right Side Button */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Events</h1>
              <p className="text-gray-400">
                Create, update, and track your events effortlessly.
              </p>
            </div>
            <button
              className="bg-violet-700 text-white px-4 py-2 rounded-lg"
              onClick={handleNewEventClick}
            >
              New Event +
            </button>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto ">
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
                  <tr
                    key={event._id}
                    className="border-b border-neutral-400 text-neutral-400 text-center"
                  >
                    <td className="p-3">{event.title}</td>
                    <td className="p-3">{new Date(event.date || "Unknown Date").toLocaleDateString()}</td>
                    <td className="p-3">{event.location}</td>
                    <td>
                      {" "}
                      <span
        className={` w-28 h-8 text-white rounded-lg ${getStatusStyle(
          String(event.status) 
        )}`}
      >
        {event.status}
      </span>
                    </td>
                    <td className="p-3">{event.ticket_price}</td>
                    <td className="p-3">
                      <button
                        className="bg-teal-300 text-black px-4 py-1 text-sm rounded-md"
                        onClick={() => onView(event)}
                      >
                        View 👁️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
            >
              Previous
            </button>
            <span className="self-center text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg ml-2"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerEvents;
