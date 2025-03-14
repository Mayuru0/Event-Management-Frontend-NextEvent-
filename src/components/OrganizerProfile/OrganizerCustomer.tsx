"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGetTicketsorganizerIdQuery } from "@/Redux/features/ticketApiSlice";
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";



const OrganizerCustomer = () => {
  const user = useSelector(selectuser)

  const organizerid = user?._id
  console.log(organizerid)

  const { data: customers = [], isLoading, isError } = useGetTicketsorganizerIdQuery(organizerid as string);


    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;  // Number of items per page
    
    // Calculate total number of pages
    const totalPages = Math.ceil(customers.length / itemsPerPage);
  
    // Get the customers to display for the current page
    const paginatedCustomers = customers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
 
  if (isLoading) {
    return (
      <p className="text-center text-xl font-semibold text-white relative mt-[20%] ">Loading customer...</p>
    )
  }
  
  if (isError) {
    return (
      <p className="text-center text-red-500 text-lg font-semibold">
        Failed to load customer.
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
    <div className="bg-[#1F1F1F] h-[700px]  rounded-r-3xl mt-28 text-white flex justify-center py-8">
      <div className="w-full max-w-5xl py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 ">
          <div>
            <h2 className="text-xl font-semibold">Customers</h2>
            <p className="text-gray-400 text-sm">View attendee list for each event effortlessly.</p>
          </div>
          <select className="bg-gray-800 text-white p-2 rounded-md border border-gray-600">
            <option>ArtFusion</option>
            <option>Other Event</option>
          </select>
        </div>

        {/* Table */}
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
                  <Image src={customer.profilePic} alt="Avatar" width={24} height={24} className="rounded-full" />
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
};

export default OrganizerCustomer;
