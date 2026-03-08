/* eslint-disable */
"use client"

import type React from "react"
import Image from "next/image"
import { useRef, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Pause, Play, Quote, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import DustParticles from "@/components/common/DustParticles"

import david from "./../../../public/images/david.jpeg"
import emily from "./../../../public/images/emily.webp"
import mike from "./../../../public/images/mike.jpeg"
import priya from "./../../../public/images/priya.webp"
import alex from "./../../../public/images/alex.jpg"
import kevin from "./../../../public/images/kevin.jpeg"

const testimonials = [
  {
    name: "Mike Peterson",
    role: "Event Attendee",
    type: "attendee",
    stars: 5,
    feedback:
      "I've attended several events through this platform, and the experience has always been top-notch. It's easy to find events I love, and the process is super smooth.",
    image: david,
  },
  {
    name: "Priya Singh",
    role: "Event Organizer",
    type: "organizer",
    stars: 5,
    feedback:
      "As an organizer, I value the reliability and innovation this team brings to the table. They've helped me grow my audience and host better events every time!",
    image: emily,
  },
  {
    name: "Emily Brown",
    role: "Event Attendee",
    type: "attendee",
    stars: 5,
    feedback:
      "This platform has introduced me to some of the best events I've ever attended. It's user-friendly, and I love how everything is so well-organized!",
    image: mike,
  },
  {
    name: "David Kim",
    role: "Event Organizer",
    type: "organizer",
    stars: 5,
    feedback:
      "Their attention to detail and customer support are unmatched. Every event I've hosted has been a success thanks to their amazing platform!",
    image: priya,
  },
  {
    name: "Kevin Walsh",
    role: "Event Organizer",
    type: "organizer",
    stars: 5,
    feedback:
      "As an organizer, I value the reliability and innovation this team brings to the table. They've helped me grow my audience and host better events every time!",
    image: alex,
  },
  {
    name: "Alex Carter",
    role: "Event Attendee",
    type: "attendee",
    stars: 5,
    feedback:
      "This platform has introduced me to some of the best events I've ever attended. It's user-friendly, and I love how everything is so well-organized!",
    image: kevin,
  },
]

const PeopleWhatSay = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [cardWidth, setCardWidth] = useState(0)
  const [gapWidth, setGapWidth] = useState(0)

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  useEffect(() => {
    const calculateDimensions = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current
        const firstCard = container.querySelector("div")
        if (firstCard) {
          const actualCardWidth = firstCard.getBoundingClientRect().width
          const containerStyle = window.getComputedStyle(container)
          const gap = Number.parseInt(containerStyle.gap) || 24
          setCardWidth(actualCardWidth)
          setGapWidth(gap)
        }
      }
    }

    calculateDimensions()
    window.addEventListener("resize", calculateDimensions)
    const timer = setTimeout(calculateDimensions, 500)
    return () => {
      window.removeEventListener("resize", calculateDimensions)
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (isPaused || isHovering || !cardWidth) return
    const interval = setInterval(() => {
      scrollToIndex((currentIndex + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [currentIndex, isPaused, isHovering, cardWidth])

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current && cardWidth > 0) {
      setCurrentIndex(index)
      scrollContainerRef.current.scrollTo({
        left: index * (cardWidth + gapWidth),
        behavior: "smooth",
      })
    }
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isMobile) return
    const container = scrollContainerRef.current
    if (!container) return
    const containerW = container.offsetWidth
    const scrollWidth = container.scrollWidth
    const mouseX = event.clientX
    const viewportWidth = window.innerWidth
    const edgeThreshold = 100
    if (scrollWidth > containerW) {
      if (mouseX < edgeThreshold) {
        const scrollPos = (scrollWidth - containerW) * (mouseX / viewportWidth)
        container.scrollLeft = Math.max(0, scrollPos)
      } else if (mouseX > viewportWidth - edgeThreshold) {
        const scrollPos = (scrollWidth - containerW) * (mouseX / viewportWidth)
        container.scrollLeft = Math.min(scrollWidth - containerW, scrollPos)
      }
    }
  }

  const handleTouchStart = () => setIsPaused(true)

  const scrollToNext = () => scrollToIndex((currentIndex + 1) % testimonials.length)
  const scrollToPrev = () => scrollToIndex((currentIndex - 1 + testimonials.length) % testimonials.length)
  const togglePause = () => setIsPaused(!isPaused)

  return (
    <section className="relative bg-[#0A0A0F] text-white py-24 overflow-hidden">
      <DustParticles count={45} />

      {/* Decorative orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#6200EE]/35 to-transparent" />
      <div className="absolute top-12 left-1/4 w-80 h-80 rounded-full bg-[#6200EE]/7 blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-80 h-80 rounded-full bg-[#03DAC6]/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6200EE]/30 bg-[#6200EE]/10 text-[#03DAC6] text-xs font-semibold tracking-widest uppercase mb-5">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            What{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6200EE] to-[#03DAC6]">
              People Say
            </span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-base leading-relaxed">
            Hear from our amazing community of event organizers and attendees. Their feedback reflects the passion and
            dedication we bring to every event.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-6 w-12 bg-gradient-to-r from-[#0A0A0F] to-transparent z-10 pointer-events-none rounded-l-2xl" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-[#0A0A0F] to-transparent z-10 pointer-events-none rounded-r-2xl" />

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-5 md:gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ WebkitOverflowScrolling: "touch" }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
          >
            {testimonials.map((t, index) => (
              <div
                key={index}
                className={`
                  relative flex-shrink-0 w-[calc(100%-2rem)] sm:w-[340px] md:w-[320px] snap-center
                  bg-[#111118] border rounded-2xl p-6 flex flex-col gap-4
                  transition-all duration-300
                  ${currentIndex === index
                    ? "border-[#6200EE]/40 shadow-xl shadow-purple-900/20"
                    : "border-white/8 hover:border-[#6200EE]/25"}
                `}
              >
                {/* Subtle top glow on active card */}
                {currentIndex === index && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[#6200EE]/80 to-transparent" />
                )}

                {/* Quote icon */}
                <div className="w-10 h-10 rounded-xl bg-[#6200EE]/12 border border-[#6200EE]/20 flex items-center justify-center flex-shrink-0">
                  <Quote className="w-4 h-4 text-[#6200EE]" />
                </div>

                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Feedback */}
                <p className="text-gray-400 text-sm leading-relaxed flex-1">
                  &ldquo;{t.feedback}&rdquo;
                </p>

                {/* Divider */}
                <div className="h-px bg-white/5" />

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative
                      ring-2 ring-offset-2 ring-offset-[#111118]
                      ${t.type === "organizer" ? "ring-[#6200EE]/50" : "ring-[#03DAC6]/50"}
                    `}
                  >
                    <Image
                      fill
                      className="object-cover"
                      src={t.image || "/placeholder.svg"}
                      alt={t.name}
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <span
                      className={`
                        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-0.5
                        ${t.type === "organizer"
                          ? "bg-[#6200EE]/15 text-[#6200EE] border border-[#6200EE]/20"
                          : "bg-[#03DAC6]/10 text-[#03DAC6] border border-[#03DAC6]/20"}
                      `}
                    >
                      {t.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-5 mt-8">
            {/* Prev */}
            <button
              onClick={scrollToPrev}
              aria-label="Previous"
              className="w-9 h-9 rounded-full bg-[#111118] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#6200EE]/40 hover:bg-[#6200EE]/15 transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Go to ${i + 1}`}
                  className={`
                    rounded-full transition-all duration-300
                    ${currentIndex === i
                      ? "w-6 h-2 bg-gradient-to-r from-[#6200EE] to-[#03DAC6]"
                      : "w-2 h-2 bg-white/15 hover:bg-white/30"}
                  `}
                />
              ))}
            </div>

            {/* Pause / Play */}
            <button
              onClick={togglePause}
              aria-label={isPaused ? "Play" : "Pause"}
              className="w-9 h-9 rounded-full bg-[#111118] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#6200EE]/40 hover:bg-[#6200EE]/15 transition-all duration-300"
            >
              {isPaused ? <Play className="w-4 h-4 ml-0.5" /> : <Pause className="w-4 h-4" />}
            </button>

            {/* Next */}
            <button
              onClick={scrollToNext}
              aria-label="Next"
              className="w-9 h-9 rounded-full bg-[#111118] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#6200EE]/40 hover:bg-[#6200EE]/15 transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PeopleWhatSay
