"use client"

import { useGetAllEventsQuery } from "@/Redux/features/eventApiSlice"
import { useSelector } from "react-redux"
import { CalendarDays, MapPin, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { selectuser } from "@/Redux/features/authSlice"

export default function SearchBar() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [eventType, setEventType] = useState("")
  const { data: events = [], isLoading, isError } = useGetAllEventsQuery()

  const user = useSelector(selectuser)

  if (isLoading) return <div className="p-4 text-center">Loading...</div>
  if (isError) return <div className="p-4 text-center">Error</div>

  // Extract unique locations from events
  const locations = [...new Set(events.map((event) => event.location))]
  const types = [...new Set(events.map((event) => event.event_type))]

  const handleSearch = () => {
    const searchParams = new URLSearchParams()
    if (location) searchParams.set("location", location)
    if (date) searchParams.set("date", date)
    if (eventType) searchParams.set("event_type", eventType)

    router.push(`/events?${searchParams.toString()}`)
  }

  const handleNavigate = () => {
    const params = new URLSearchParams()
    params.set("role", "organizer")
    router.push(`/auth/signup?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-3 sm:py-6">
      <div className="bg-white shadow-lg rounded-2xl md:rounded-full">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr,1fr,1fr,auto] gap-2 md:gap-0">
          {/* Location */}
          <div className="p-2 md:p-3 border-b md:border-b-0 md:border-r border-gray-200 relative">
            <div className="flex items-center gap-2 hover:bg-gray-100 rounded-t-lg md:rounded-l-full md:rounded-tr-none p-2 cursor-pointer">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="grid text-left w-full">
                <span className="text-xs font-medium font-kulim">Location</span>
                <select
                  className="text-sm font-kulim text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer w-full"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Select Location</option>
                  {locations.map((loc, index) => (
                    <option key={index} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="p-2 md:p-3 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="flex items-center gap-2 hover:bg-gray-100 p-2 cursor-pointer">
              <CalendarDays className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="grid text-left w-full">
                <span className="text-xs font-medium font-kulim">Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="text-sm font-kulim text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer w-full"
                  placeholder="Add Date"
                />
              </div>
            </div>
          </div>

          {/* Type */}
          <div className="p-2 md:p-3 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="flex items-center gap-2 hover:bg-gray-100 p-2 cursor-pointer">
              <div className="grid text-left w-full">
                <span className="text-xs font-medium font-kulim">Type</span>
                <select
                  className="text-sm font-kulim text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer w-full"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                >
                  <option value="">Event Type</option>
                  {types.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center md:justify-start p-2 md:p-0">
            <button
              className="w-full md:m-3 p-3 md:p-4 rounded-full bg-[#6200EE] hover:bg-purple-700 text-white transition-colors"
              aria-label="Search"
              onClick={handleSearch}
            >
              <Search className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4 md:mt-6">
        {(!user || user?.role === "organizer") && (
          <button
            onClick={handleNavigate}
            className="text-white border border-white px-4 py-2 md:px-5 md:py-4 rounded-full hover:bg-white/10 font-kulim text-sm md:text-base"
          >
            Become a Host
          </button>
        )}
      </div>
    </div>
  )
}

