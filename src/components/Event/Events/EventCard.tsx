"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import ESearchBar from "./ESearchBar"
import Swal from "sweetalert2"
import { useGetAllEventsQuery } from "@/Redux/features/eventApiSlice"
import { useSelector } from "react-redux"
import { selectuser } from "@/Redux/features/authSlice"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, MapPin, ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

type SortOption = "relevance" | "popularity" | "latest" | "price-low" | "price-high"

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "popularity", label: "Most Popular" },
  { value: "latest", label: "Latest First" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
]

const ITEMS_PER_PAGE = 9

export default function EventCard() {
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const user = useSelector(selectuser)
  const router = useRouter()
  const { data: events = [], isLoading, isError } = useGetAllEventsQuery()
  const [isClient, setIsClient] = useState(false)

  const [filters, setFilters] = useState({
    location: "",
    date: "",
    event_type: "",
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      const searchParams = new URLSearchParams(window.location.search)
      setFilters({
        location: searchParams.get("location") || "",
        date: searchParams.get("date") || "",
        event_type: searchParams.get("event_type") || "",
      })
    }
  }, [isClient])

  const filteredAndSortedEvents = useMemo(() => {
    return [...events]
      .filter((event) => {
        const eventDate = new Date(event.date)
        return (
          event.status === "Pending" &&
          (filters.location === "" || event.location === filters.location) &&
          (filters.date === "" || eventDate.toISOString().split("T")[0] === filters.date) &&
          (filters.event_type === "" || event.event_type === filters.event_type)
        )
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "popularity": return (b.popularity || 0) - (a.popularity || 0)
          case "latest":    return new Date(b.date).getTime() - new Date(a.date).getTime()
          case "price-low": return (a.ticket_price || 0) - (b.ticket_price || 0)
          case "price-high": return (b.ticket_price || 0) - (a.ticket_price || 0)
          default: return 0
        }
      })
  }, [sortBy, filters, events])

  const totalPages = Math.ceil(filteredAndSortedEvents.length / ITEMS_PER_PAGE)
  const paginatedEvents = filteredAndSortedEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const goToPage = (page: number) => setCurrentPage(page)

  const handleSearch = (searchFilters: typeof filters) => {
    setFilters(searchFilters)
    setCurrentPage(1)
  }

  const handleBuyTicket = (eventId: string) => {
    if (user) {
      router.push(`/events/${eventId}`)
    } else {
      Swal.fire({
        title: "You are not logged in!",
        text: "Please log in to purchase tickets.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
        background: "#1A1A28",
        color: "#fff",
        confirmButtonColor: "#6200EE",
      }).then((result) => {
        if (result.isConfirmed) router.push("/auth/signin")
      })
    }
  }

  if (isLoading) {
    return (
      <div className="bg-[#0A0A0F] min-h-[40vh] flex flex-col items-center justify-center gap-6 py-20">
        <ESearchBar onSearch={handleSearch} />
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[#6200EE] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-[#0A0A0F] min-h-[30vh] flex flex-col items-center justify-center py-20">
        <ESearchBar onSearch={handleSearch} />
        <p className="text-red-400 font-medium mt-8">Failed to load events. Please try again.</p>
      </div>
    )
  }

  const selectedSortLabel = sortOptions.find((o) => o.value === sortBy)?.label ?? "Sort"

  return (
    <div className="bg-[#0A0A0F] text-white min-h-screen pb-20">
      {/* Search bar */}
      <div className="max-w-7xl mx-auto">
        <ESearchBar onSearch={handleSearch} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Toolbar row */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-500 text-sm">
            {filteredAndSortedEvents.length > 0 ? (
              <>
                Showing{" "}
                <span className="text-white font-semibold">{filteredAndSortedEvents.length}</span>{" "}
                event{filteredAndSortedEvents.length !== 1 ? "s" : ""}
              </>
            ) : null}
          </p>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-[#111118] border border-white/8 rounded-xl text-sm text-gray-300 hover:text-white hover:border-[#6200EE]/35 transition-all duration-300"
            >
              {selectedSortLabel}
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 bg-[#111118] border border-white/8 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value)
                        setIsDropdownOpen(false)
                        setCurrentPage(1)
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2
                        ${sortBy === opt.value
                          ? "bg-[#6200EE]/15 text-[#03DAC6]"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      {sortBy === opt.value && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#03DAC6] flex-shrink-0" />
                      )}
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Event grid */}
        {paginatedEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#111118] border border-white/8 flex items-center justify-center mb-5">
              <span className="text-3xl">🎭</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No events found</h3>
            <p className="text-gray-600 text-sm max-w-xs">
              Try adjusting your filters or check back later for new events.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`${currentPage}-${JSON.stringify(filters)}-${sortBy}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12"
          >
            {paginatedEvents.map((event, index) => (
              <motion.div
                key={event._id || index}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="group relative bg-[#111118] border border-white/8 rounded-2xl overflow-hidden hover:border-[#6200EE]/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/15"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {event.image ? (
                    <Image
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      src={event.image}
                      alt={event.title}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1A1A28] flex items-center justify-center">
                      <span className="text-gray-700 text-sm">No Image</span>
                    </div>
                  )}

                  {/* Price badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-gradient-to-r from-[#6200EE] to-[#7B2FFF] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {event.ticket_price} LKR
                    </span>
                  </div>

                  {/* Type pill */}
                  {event.event_type && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-black/50 backdrop-blur-sm border border-white/15 text-white/80 text-[10px] font-medium px-2.5 py-1 rounded-full">
                        {event.event_type}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-[#03DAC6] transition-colors duration-300">
                    {event.title}
                  </h3>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-gray-500 text-xs">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#6200EE]/70" />
                      {new Date(event.date || "").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#6200EE]/70" />
                      {event.location}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  <button
                    onClick={() => handleBuyTicket(event._id)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6200EE] to-[#7B2FFF] hover:from-[#7B2FFF] hover:to-[#9040FF] text-white py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg shadow-purple-900/20 group-hover:shadow-purple-900/40"
                  >
                    Buy Tickets
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center gap-2"
          >
            <button
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#111118] border border-white/8 text-gray-400 hover:text-white hover:border-[#6200EE]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 ${
                  currentPage === page
                    ? "bg-gradient-to-r from-[#6200EE] to-[#7B2FFF] text-white shadow-lg shadow-purple-900/30"
                    : "bg-[#111118] border border-white/8 text-gray-400 hover:text-white hover:border-[#6200EE]/30"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#111118] border border-white/8 text-gray-400 hover:text-white hover:border-[#6200EE]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
