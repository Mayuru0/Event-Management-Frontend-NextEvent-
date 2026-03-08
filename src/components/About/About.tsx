"use client"
import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import DustParticles from "@/components/common/DustParticles"
import { Sparkles, Users, MapPin, Star } from "lucide-react"

const stats = [
  { icon: Sparkles, value: "500+", label: "Events Hosted" },
  { icon: Users, value: "50K+", label: "Happy Attendees" },
  { icon: MapPin, value: "25+", label: "Cities Covered" },
  { icon: Star, value: "4.9★", label: "Average Rating" },
]

const About = () => {
  return (
    <div className="relative text-white py-24 px-6 md:px-12 lg:px-20 bg-[#0A0A0F] overflow-hidden">
      <DustParticles count={50} />

      {/* Decorative orbs */}
      <div className="absolute top-16 left-8 w-72 h-72 rounded-full bg-[#6200EE]/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-8 w-72 h-72 rounded-full bg-[#03DAC6]/6 blur-3xl pointer-events-none" />

      {/* Top rule */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-[#6200EE]/35 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section badge */}
        <div className="flex justify-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6200EE]/30 bg-[#6200EE]/10 text-[#03DAC6] text-xs font-semibold tracking-widest uppercase">
            About Us
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-[420px] md:h-[520px] order-2 lg:order-1"
          >
            {/* Purple glow behind images */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-56 rounded-full bg-[#6200EE]/15 blur-3xl" />
            </div>

            {/* Bottom-left image */}
            <div className="absolute bottom-0 left-0 w-[58%] h-[58%] rounded-2xl overflow-hidden shadow-2xl z-10 border border-white/10">
              <Image src="/img/a2.png" alt="Team collaboration" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Top-right image */}
            <div className="absolute top-0 right-0 w-[58%] h-[58%] rounded-2xl overflow-hidden shadow-2xl z-0 border border-white/10">
              <Image src="/img/a1.png" alt="Event venue" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute bottom-[22%] right-[4%] z-20 bg-[#1A1A28]/90 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 shadow-xl">
              <p className="text-[#03DAC6] text-xl font-bold">4.9 ★</p>
              <p className="text-gray-500 text-xs mt-0.5">Customer Rating</p>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 order-1 lg:order-2"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
                Who We{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6200EE] to-[#03DAC6]">
                  Are
                </span>
              </h2>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                At the heart of our platform is a passion for bringing people together through extraordinary events.
                We specialize in connecting event organizers and attendees, ensuring seamless experiences from start to
                finish. With innovative collaboration and a commitment to excellence, we create opportunities to
                celebrate, learn, and inspire.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="bg-[#111118] border border-white/8 rounded-xl p-4 hover:border-[#6200EE]/35 transition-all duration-300 hover:bg-[#1A1A28]/80"
                >
                  <Icon className="w-5 h-5 text-[#03DAC6] mb-2" />
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6200EE] to-[#7B2FFF] hover:from-[#7B2FFF] hover:to-[#9040FF] text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg shadow-purple-900/30">
              Contact Us
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default About
