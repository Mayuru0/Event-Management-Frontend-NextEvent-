"use client"

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDown } from '@fortawesome/free-regular-svg-icons'; // Import the icon
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";

import { useGetTicketsUserIdQuery } from '@/Redux/features/ticketApiSlice';


function MyTickets() {
    const user = useSelector(selectuser)
    const UserId = user?._id

const { data: tickets = [], isLoading, isError } = useGetTicketsUserIdQuery(UserId as string);

 // Pagination state
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 5; // Number of items per page

 // Calculate total number of pages
 const totalPages = Math.ceil(tickets.length / itemsPerPage);

 // Get the tickets to display for the current page
 const paginatedTickets = tickets.slice(
     (currentPage - 1) * itemsPerPage,
     currentPage * itemsPerPage
 );

if (isLoading) {
  return (
    <p className="text-center text-xl font-semibold text-white relative -mt-[20%] ">Loading Ticket...</p>
  )
}

if (isError) {
  return (
    <p className="text-center text-red-500 text-lg font-semibold">
      Failed to load Ticket.
    </p>
  )
}

 // Handle page change
 const handlePageChange = (page: number) => {
  if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
  }
};
  return (
    <div className="bg-[#1F1F1F] h-[700px] rounded-r-3xl mt-28 text-white flex justify-center py-8">
      <div className="overflow-x-auto w-full max-w-4xl py-12">
        <h2 className="text-lg font-semibold mb-2">My Tickets</h2>
        <p className="text-gray-400 mb-4 text-sm">Download your tickets and view purchase history.</p>
        
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
                  <button className="flex items-center bg-teal-400 text-black px-1 py-0.5 text-xs rounded-lg">Download <FontAwesomeIcon icon={faCircleDown} className="ml-2 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
                    <button
                        className="bg-gray-800 text-white p-2 mx-2 rounded-md"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    <span className="text-white text-sm">{`Page ${currentPage} of ${totalPages}`}</span>
                    <button
                        className="bg-gray-800 text-white p-2 mx-2 rounded-md"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
      </div>
    </div>
  );
}

export default MyTickets;
