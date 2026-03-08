"use client"

import { useGetAllEventsQuery } from "@/Redux/features/eventApiSlice"
import { CalendarDays, MapPin, Search, SlidersHorizontal } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

interface ESearchBarProps {
  onSearch: (filters: { location: string; date: string; event_type: string }) => void
}

export default function ESearchBar({ onSearch }: ESearchBarProps) {
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [event_type, setType] = useState("")
  const { data: events = [], isLoading, isError } = useGetAllEventsQuery()

  if (isLoading)
    return (
      <div className="flex justify-center py-6">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#6200EE] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )

  if (isError)
    return (
      <div className="flex justify-center py-4">
        <p className="text-red-400 text-sm">Failed to load filters.</p>
      </div>
    )

  const handleSearch = () => onSearch({ location, date, event_type })

  const locations = [...new Set(events.map((e) => e.location))]
  const types = [...new Set(events.map((e) => e.event_type))]

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDate(e.target.value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15 }}
      className="w-full max-w-4xl mx-auto px-4 py-6"
    >
      {/* Label row */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#03DAC6]" />
        <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">Filter Events</span>
      </div>

      {/* Search bar */}
      <div className="bg-[#111118] border border-white/8 rounded-2xl overflow-hidden shadow-xl shadow-black/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.5fr,1fr,1fr,auto]">
          {/* Location */}
          <div className="p-3 md:p-4 border-b sm:border-b-0 sm:border-r border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6200EE]/12 border border-[#6200EE]/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[#6200EE]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Location</p>
              <select
                className="text-sm text-white bg-transparent border-none focus:outline-none cursor-pointer w-full placeholder:text-gray-600"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="" className="bg-[#1A1A28] text-gray-300">All Locations</option>
                {locations.map((loc, i) => (
                  <option key={i} value={loc} className="bg-[#1A1A28] text-white">
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="p-3 md:p-4 border-b sm:border-b-0 sm:border-r border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6200EE]/12 border border-[#6200EE]/20 flex items-center justify-center flex-shrink-0">
              <CalendarDays className="w-3.5 h-3.5 text-[#6200EE]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Date</p>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                className="text-sm text-white bg-transparent border-none focus:outline-none cursor-pointer w-full [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Type */}
          <div className="p-3 md:p-4 border-b md:border-b-0 md:border-r border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6200EE]/12 border border-[#6200EE]/20 flex items-center justify-center flex-shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#6200EE]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Event Type</p>
              <select
                className="text-sm text-white bg-transparent border-none focus:outline-none cursor-pointer w-full"
                value={event_type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="" className="bg-[#1A1A28] text-gray-300">All Types</option>
                {types.map((type, i) => (
                  <option key={i} value={type} className="bg-[#1A1A28] text-white">
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search button */}
          <div className="flex items-center justify-center p-3 md:p-4">
            <button
              onClick={handleSearch}
              aria-label="Search"
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6200EE] to-[#7B2FFF] hover:from-[#7B2FFF] hover:to-[#9040FF] text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-purple-900/30"
            >
              <Search className="w-4 h-4" />
              <span className="md:hidden lg:inline">Search</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
