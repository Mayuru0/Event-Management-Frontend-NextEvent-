"use client"
import Image from "next/image"
import hero1 from "./../../../public/landing.png"
import SearchBar from "./SearchBar"
import DustParticles from "@/components/common/DustParticles"
import { motion } from "framer-motion"

const stats = [
  { num: "500+", label: "Events" },
  { num: "50K+", label: "Attendees" },
  { num: "200+", label: "Organizers" },
]

const Hero1 = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={hero1 || "/placeholder.svg"}
          alt="Hero background"
          priority
          fill
          style={{ objectFit: "cover" }}
          className="brightness-[0.38] scale-105"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#0A0A0F]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#6200EE]/20 via-transparent to-[#03DAC6]/10" />

      {/* Dust particles */}
      <DustParticles count={75} />

      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#6200EE]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#03DAC6]/8 blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#03DAC6]/30 bg-[#03DAC6]/10 text-[#03DAC6] text-xs font-semibold tracking-widest uppercase backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#03DAC6] animate-pulse" />
            Sri Lanka&apos;s #1 Event Platform
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold max-w-4xl leading-tight tracking-tight"
        >
          Plan Events.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#03DAC6] to-[#6200EE]">
            Buy Tickets.
          </span>
          <br className="hidden sm:block" />
          {" "}All in One Place.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white/55 text-sm sm:text-base md:text-lg lg:text-xl mt-5 font-light max-w-2xl leading-relaxed"
        >
          Simplify your event journey, from planning to participation.
          Join thousands of organizers and attendees across the island.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 md:mt-14 w-full"
        >
          <SearchBar />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex items-center gap-10 mt-12"
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center relative">
              {i > 0 && (
                <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-px h-6 bg-white/15" />
              )}
              <p className="text-white text-xl font-bold">{stat.num}</p>
              <p className="text-white/35 text-xs mt-0.5 tracking-wide">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A0A0F] to-transparent pointer-events-none" />
    </div>
  )
}

export default Hero1
