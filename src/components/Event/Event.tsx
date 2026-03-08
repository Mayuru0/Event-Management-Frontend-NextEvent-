"use client"
import { Averia_Gruesa_Libre } from "next/font/google"
import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useGetAllEventsQuery } from "@/Redux/features/eventApiSlice"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import { selectuser } from "@/Redux/features/authSlice"
import { useRouter } from "next/navigation"
import DustParticles from "@/components/common/DustParticles"
import { Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react"


const averiaGruesaLibre = Averia_Gruesa_Libre({ subsets: ["latin"], weight: ["400"] })

const Event = () => {
  const { data: events = [], isLoading, isError } = useGetAllEventsQuery()
  const user = useSelector(selectuser)
  const router = useRouter()

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

  const pendingEvents = events.filter((event) => event.status === "Pending").slice(0, 3)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 bg-[#0A0A0F]">
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
      <div className="flex justify-center py-24 bg-[#0A0A0F]">
        <p className="text-red-400 font-medium">Failed to load events.</p>
      </div>
    )
  }

  if (pendingEvents.length === 0) {
    return (
      <div className="flex justify-center py-24 bg-[#0A0A0F]">
        <p className="text-gray-500">No upcoming events available.</p>
      </div>
    )
  }

  return (
    <div className="relative bg-[#0A0A0F] py-24 px-4 md:px-8 overflow-hidden">
      <DustParticles count={45} />

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#6200EE]/35 to-transparent" />
      <div className="absolute top-16 left-1/3 w-96 h-96 rounded-full bg-[#6200EE]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-1/3 w-96 h-96 rounded-full bg-[#03DAC6]/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6200EE]/30 bg-[#6200EE]/10 text-[#03DAC6] text-xs font-semibold tracking-widest uppercase mb-6">
            <Sparkles className="w-3 h-3" />
            Upcoming Events
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mt-4">
            Explore{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6200EE] to-[#03DAC6]">
              Upcoming Events
            </span>
          </h2>
          <p className="text-gray-500 text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            Discover a variety of exciting events happening soon! Whether you&apos;re looking to attend or organize,
            find the perfect experience for you.
          </p>
        </div>

        {/* Event cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingEvents.map((event, index) => (
            <motion.div
              key={event._id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="group relative bg-[#111118] border border-white/8 rounded-2xl overflow-hidden hover:border-[#6200EE]/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20"
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
                    <span className="text-gray-600 text-sm">No Image</span>
                  </div>
                )}

                {/* Price badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span
                    className={`bg-gradient-to-r from-[#6200EE] to-[#7B2FFF] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg ${averiaGruesaLibre.className}`}
                  >
                    {event.ticket_price} LKR
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <h3 className="text-white font-bold text-lg leading-snug line-clamp-2 group-hover:text-[#03DAC6] transition-colors duration-300">
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

                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{event.description}</p>

                <button
                  onClick={() => handleBuyTicket(event._id)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6200EE] to-[#7B2FFF] hover:from-[#7B2FFF] hover:to-[#9040FF] text-white py-2.5 px-4 rounded-full transition-all duration-300 text-sm font-semibold shadow-lg shadow-purple-900/25 group-hover:shadow-purple-900/45"
                >
                  Buy Tickets
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => router.push("/events")}
            className="inline-flex items-center gap-2 border border-white/12 hover:border-[#6200EE]/50 text-white/60 hover:text-white px-6 py-3 rounded-full transition-all duration-300 text-sm font-medium hover:bg-[#6200EE]/10"
          >
            View All Events
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* <PeopleWhatSay /> */}
    </div>
  )
}

export default Event
