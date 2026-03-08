/* eslint-disable */
"use client"

import Image from "next/image"
import React from "react"
import hero1 from "./../../../../public/landing.png"
import { useRouter } from "next/navigation"
import { ArrowLeft, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import DustParticles from "@/components/common/DustParticles"

const EHero1 = () => {
  const router = useRouter()

  return (
    <div className="relative w-full h-[58vh] min-h-[380px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={hero1}
          alt="Events Hero"
          fill
          priority
          className="object-cover brightness-[0.32] scale-105"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0A0A0F]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#6200EE]/15 via-transparent to-[#03DAC6]/10" />

      {/* Dust particles */}
      <DustParticles count={65} />

      {/* Decorative orbs */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-[#6200EE]/12 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-[#03DAC6]/8 blur-3xl pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 left-6 md:left-12 z-20 pt-16 md:pt-8">
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </motion.button>
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-5"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#03DAC6]/30 bg-[#03DAC6]/10 text-[#03DAC6] text-xs font-semibold tracking-widest uppercase backdrop-blur-sm">
            <Sparkles className="w-3 h-3" />
            Discover Events
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight max-w-3xl"
        >
          Explore{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#03DAC6] to-[#6200EE]">
            All Events
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="text-white/50 text-sm md:text-base mt-4 max-w-xl leading-relaxed"
        >
          Discover a variety of exciting events happening soon. Browse by category,
          date, or location and find the perfect experience for you.
        </motion.p>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-3 mt-8 flex-wrap justify-center"
        >
          {[
            { label: "500+ Events" },
            { label: "25+ Cities" },
            { label: "50K+ Attendees" },
          ].map((s) => (
            <span
              key={s.label}
              className="px-4 py-1.5 rounded-full bg-white/8 border border-white/10 text-white/60 text-xs font-medium backdrop-blur-sm"
            >
              {s.label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade into page bg */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0F] to-transparent pointer-events-none" />
    </div>
  )
}

export default EHero1
