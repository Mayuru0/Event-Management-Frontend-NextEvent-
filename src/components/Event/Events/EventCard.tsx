"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import ESearchBar from "./ESearchBar"
//import Link from "next/link"
import Swal from "sweetalert2"; // Import SweetAlert2
import { useGetAllEventsQuery } from "@/Redux/features/eventApiSlice"
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";
import {  useRouter } from "next/navigation";
type SortOption = "relevance" | "popularity" | "latest" | "price-low" | "price-high"

const sortOptions: Record<SortOption, string> = {
  relevance: "Relevance",
  popularity: "Sort by popularity",
  latest: "Sort by latest",
  "price-low": "Price: low to high",
  "price-high": "Price: high to low",
}

const ITEMS_PER_PAGE = 9

export default function EventCard() {
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const user = useSelector(selectuser)
  const router = useRouter();
  const { data: events = [], isLoading, isError } = useGetAllEventsQuery()

  const [isClient, setIsClient] = useState(false); 
  

  const [filters, setFilters] = useState({
    location: "",
    date: "",
    event_type: "",
  });

  //const searchParams = useSearchParams();
  // Update filters from URL params
  // useEffect(() => {
  //   setFilters({
  //     location: searchParams.get("location") || "",
  //     date: searchParams.get("date") || "",
  //     event_type: searchParams.get("event_type") || "",
  //   });
  // }, [searchParams]);

  // Set isClient to true after component mounts (client-side)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Set filters only after the component is mounted on the client-side
  useEffect(() => {
    if (isClient) {
      const searchParams = new URLSearchParams(window.location.search);
      setFilters({
        location: searchParams.get("location") || "",
        date: searchParams.get("date") || "",
        event_type: searchParams.get("event_type") || "",
      });
    }
  }, [isClient]);

  // Sorting and Filtering Logic
  const filteredAndSortedEvents = useMemo(() => {
    return [...events]
      .filter((event) => {
        const eventDate = new Date(event.date); // Convert event.date to a Date object
        return (
          (filters.location === "" || event.location === filters.location) &&
          (filters.date === "" || eventDate.toISOString().split('T')[0] === filters.date) &&
          (filters.event_type === "" || event.event_type === filters.event_type)
        )
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "popularity":
            return (b.popularity || 0) - (a.popularity || 0)
          case "latest":
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          case "price-low":
            return (a.ticket_price || 0) - (b.ticket_price || 0)
          case "price-high":
            return (b.ticket_price || 0) - (a.ticket_price || 0)
          default:
            return 0 // Keep the original order for "relevance"
        }
      })
  }, [sortBy, filters, events])
  

  // Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedEvents.length / ITEMS_PER_PAGE)
  const paginatedEvents = filteredAndSortedEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = (searchFilters: typeof filters) => {
    setFilters(searchFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  if (isLoading) {
    return (
      <p className="text-center text-xl font-semibold text-white relative -mt-[20%] ">Loading events...</p>
    )
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 text-lg font-semibold">
        Failed to load events.
      </p>
    )
  }

  
  const handleBuyTicket = (eventId: string) => {
    if (user) {
      router.push(`/events/${eventId}`);
    } else {
      Swal.fire({
        title: "You are not logged in!",
        text: "Please log in to purchase tickets.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/auth/signin");
        }
      });
    }
  };
  


console.log(events)
  return (
    <div className="min-h-screen text-white">
      <ESearchBar onSearch={handleSearch} />

      <div className="max-w-7xl mx-auto p-6">
        {/* Sort Dropdown */}
        <div className="flex justify-end mb-6 relative mt-20">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-transparent border border-purple-500 text-white px-4 py-2 rounded-md flex items-center justify-between w-48"
          >
            {sortOptions[sortBy]}
            <svg
              className={`w-4 h-4 ml-2 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Options */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-zinc-900 border border-purple-500 rounded-md shadow-lg z-10">
              {Object.entries(sortOptions).map(([value, label]) => (
                <button
                  key={value}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    sortBy === value ? "bg-purple-500/20" : ""
                  } hover:bg-purple-500/20`}
                  onClick={() => {
                    setSortBy(value as SortOption)
                    setIsDropdownOpen(false)
                    setCurrentPage(1) // Reset to first page when sorting changes
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

      
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Use paginatedEvents here instead of events */}
          {paginatedEvents.length > 0 ? (
          Array.isArray(paginatedEvents) && paginatedEvents.map((event, index) => (
            <div
              key={event._id || index}
              className="group relative rounded-3xl overflow-hidden bg-zinc-900 transition-transform hover:scale-[1.02]"
            >
              <div className="aspect-[4/3] relative">
                {event.image ? (
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-300">No Image Available</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold font-raleway">{event.title}</h3>
                  <span className="text-2xl font-bold text-[#03DAC6] font-averia">
                    ${event.ticket_price ? event.ticket_price.toFixed(2) : "Free"}
                  </span>
                </div>
                <div className="flex items-center justify-between font-kulim text-lg text-[#B0B0B0] mb-2">
                  <span>{new Date(event.date || "Unknown Date").toLocaleDateString()}</span>
                  <span>{event.location || "Unknown Location"}</span>
                </div>
                <p className="text-base text-[#888888] mb-4 justify-center font-kulim text-center">
                  {event.description || "No description available."}
                </p>
                {/* <Link href={`/events/${event._id}`} passHref> */}
                  <button
                  onClick={() => handleBuyTicket(event._id)}
                  className="w-full bg-[#6200EE] hover:bg-purple-700 text-white py-2 px-4 rounded-full transition-colors duration-200">
                    Buy Tickets
                  </button>
                {/* </Link> */}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-white col-span-full relative text-2xl">No events available.</p>
        )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-[#6200EE] text-white disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1
                    ? "bg-[#6200EE] text-white"
                    : "bg-zinc-800 text-gray-300 hover:bg-purple-500/20"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md bg-[#6200EE] text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
