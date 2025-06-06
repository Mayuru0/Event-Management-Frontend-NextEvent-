"use client"

import { useGetAllEventsQuery } from "@/Redux/features/eventApiSlice"
import { CalendarDays, MapPin, Search } from "lucide-react"
import { useState } from "react"

interface ESearchBarProps {
  onSearch: (filters: {
    location: string
    date: string
    event_type: string
  }) => void
}

export default function ESearchBar({ onSearch }: ESearchBarProps) {
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [event_type, setType] = useState("")
  const { data: events = [], isLoading, isError } = useGetAllEventsQuery()

  if (isLoading) return <div>Loading...</div>

  if (isError) return <div>Error</div>

  const handleSearch = () => {
    onSearch({ location, date, event_type })
  } 

  // Extract unique locations from events
  const locations = [...new Set(events.map(event => event.location))]
  const types = [...new Set(events.map(event => event.event_type))]

  // Handle date change and convert it back to yyyy-mm-dd format
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value
    setDate(selectedDate) // Store the date in yyyy-mm-dd format
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 relative">
      <div className="bg-white shadow-lg rounded-3xl md:rounded-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.5fr,1fr,1fr,auto] items-center gap-2 ">
          {/* Location */}
          <div className="p-2 md:p-3 border-b md:border-b-0 md:border-r border-gray-200 relative">
          <div className="flex items-center gap-2  rounded-t-lg md:rounded-l-full md:rounded-tr-none p-2 cursor-pointer">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="text-left w-full">
                <span className="text-xs font-medium text-[#121212]">Location</span>
                <select
                  className="text-sm text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer w-full"
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
          <div className="flex items-center gap-2  p-2 cursor-pointer">
              <CalendarDays className="w-4 h-4 text-gray-500 flex-shrink-0 " />
              <div className="text-left w-full">
                <span className="text-xs font-medium text-[#121212]">Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  className="text-sm font-kulim text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer w-full"
                  placeholder="Add Date"
                />
              </div>
            </div>
          </div>

          {/* Type */}
          <div className="p-2 md:p-3 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="flex items-center gap-2  p-2 cursor-pointer">
              <div className="text-left w-full">
                <span className="text-xs font-medium text-[#121212]">Type</span>
                <select
                  className="text-sm text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer w-full"
                  value={event_type}
                  onChange={(e) => setType(e.target.value)}
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
    </div>
  )
}
