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
    <div className="w-full max-w-4xl mx-auto px-4 py-6 -mt-[30%] relative ">
      <div className="bg-white shadow-lg rounded-3xl md:rounded-full">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr,1fr,1fr,auto] items-center">
          {/* Location */}
          <div className="p-3 border-b md:border-b-0 md:border-r mt-2 h-10 border-gray-400 relative group">
            <div className="flex items-center gap-2 hover:bg-gray-100 rounded-t-3xl md:rounded-l-full md:rounded-tr-none p-2 -mt-6 cursor-pointer">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="grid text-left w-full">
                <span className="text-xs font-medium font-kulim text-[#121212]">Location</span>
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
          <div className="p-3 border-b md:border-b-0 md:border-r mt-2 h-10 border-gray-400">
            <div className="flex items-center gap-2 hover:bg-gray-100 p-2 cursor-pointer -mt-6">
              <CalendarDays className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="grid text-left w-full">
                <span className="text-xs font-medium font-kulim text-[#121212]">Date</span>
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
          <div className="p-3 border-b  md:border-b-0">
            <div className="flex items-center gap-2 hover:bg-gray-100 p-2 cursor-pointer">
              <div className="grid text-left w-full">
                <span className="text-xs font-medium font-kulim text-[#121212]">Type</span>
                <select
                  className="text-sm font-kulim text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer w-full"
                  value={event_type}
                  onChange={(e) => setType(e.target.value)}
                >
                   <option value="">Event Type</option>
                  {types.map((types, index) => (
                    <option key={index} value={types}>
                      {types}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            className="md:m-3 w-12 ml-20 md:ml-0 p-2 md:p-4 rounded-full bg-[#6200EE] hover:bg-purple-700 text-white transition-colors md:w-auto"
            aria-label="Search"
            onClick={handleSearch}
          >
            <Search className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>
    </div>
  )
}
