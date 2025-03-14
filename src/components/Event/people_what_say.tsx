"use client"

import type React from "react"

import Image from "next/image"
import { useRef, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

// Import images
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
    feedback:
      "I've attended several events through this platform, and the experience has always been top-notch. It's easy to find events I love, and the process is super smooth.",
    image: david,
  },
  {
    name: "Priya Singh",
    role: "Event Organizer",
    feedback:
      "As an organizer, I value the reliability and innovation this team brings to the table. They've helped me grow my audience and host better events every time!",
    image: emily,
  },
  {
    name: "Emily Brown",
    role: "Event Attendee",
    feedback:
      "This platform has introduced me to some of the best events I've ever attended. It's user-friendly, and I love how everything is so well-organized!",
    image: mike,
  },
  {
    name: "David Kim",
    role: "Event Organizer",
    feedback:
      "Their attention to detail and customer support are unmatched. Every event I've hosted has been a success thanks to their amazing platform!",
    image: priya,
  },
  {
    name: "Kevin",
    role: "Event Organizer",
    feedback:
      "As an organizer, I value the reliability and innovation this team brings to the table. They've helped me grow my audience and host better events every time!",
    image: alex,
  },
  {
    name: "alex",
    role: "Event Attendee",
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
  const [containerWidth, setContainerWidth] = useState(0)

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Calculate card width and gap on mount and resize
  useEffect(() => {
    const calculateDimensions = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current
        const containerRect = container.getBoundingClientRect()
        setContainerWidth(containerRect.width)

        const firstCard = container.querySelector("div")

        if (firstCard) {
          // Get the actual rendered width of the card
          const actualCardWidth = firstCard.getBoundingClientRect().width

          // Get the gap from the container's style
          const containerStyle = window.getComputedStyle(container)
          const gap = Number.parseInt(containerStyle.gap) || 32

          setCardWidth(actualCardWidth)
          setGapWidth(gap)
        }
      }
    }

    // Initial calculation
    calculateDimensions()

    // Recalculate on window resize
    window.addEventListener("resize", calculateDimensions)

    // Add a small delay to ensure accurate measurements after render
    const timer = setTimeout(calculateDimensions, 500)

    return () => {
      window.removeEventListener("resize", calculateDimensions)
      clearTimeout(timer)
    }
  }, [])

  // Auto scroll functionality
  useEffect(() => {
    if (isPaused || isHovering || !cardWidth) return

    const interval = setInterval(() => {
      scrollToIndex((currentIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex, isPaused, isHovering, cardWidth])

  // Function to scroll to a specific index
  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current && cardWidth > 0) {
      setCurrentIndex(index)

      const scrollPosition = index * (cardWidth + gapWidth)

      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isMobile) return

    const container = scrollContainerRef.current
    if (container) {
      const containerWidth = container.offsetWidth
      const scrollWidth = container.scrollWidth
      const mouseX = event.clientX
      const viewportWidth = window.innerWidth

      // Define threshold for how close the mouse needs to be to the edges to trigger scrolling
      const edgeThreshold = 100 // pixels from left or right edge

      // Calculate scroll percentage based on mouse position
      if (scrollWidth > containerWidth) {
        // If mouse is within the threshold of the left or right edge, allow scrolling
        if (mouseX < edgeThreshold) {
          // Mouse is near the left edge
          const scrollPercentage = mouseX / viewportWidth
          const scrollPos = (scrollWidth - containerWidth) * scrollPercentage
          container.scrollLeft = Math.max(0, scrollPos)
        } else if (mouseX > viewportWidth - edgeThreshold) {
          // Mouse is near the right edge
          const scrollPercentage = mouseX / viewportWidth
          const scrollPos = (scrollWidth - containerWidth) * scrollPercentage
          container.scrollLeft = Math.min(scrollWidth - containerWidth, scrollPos)
        }
      }
    }
  }

  // Add touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return
    setIsPaused(true) // Pause auto-scroll during touch interaction
  }

  const scrollToNext = () => {
    scrollToIndex((currentIndex + 1) % testimonials.length)
  }

  const scrollToPrev = () => {
    scrollToIndex((currentIndex - 1 + testimonials.length) % testimonials.length)
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  return (
    <section className="bg-[#121212] text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8">What People Say</h2>
        <p className="text-center text-gray-400 mb-8 md:mb-12 max-w-3xl mx-auto px-4">
          Hear from our amazing community of event organizers and attendees! Their feedback reflects the passion and
          dedication we bring to every event. Discover how we've helped create unforgettable experiences, and let their
          words inspire you to join us in making more incredible memories.
        </p>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 md:gap-8 pb-6 snap-x snap-mandatory"
            style={{
              scrollBehavior: "smooth",
              msOverflowStyle: "none" /* IE and Edge */,
              scrollbarWidth: "none" /* Firefox */,
              WebkitOverflowScrolling: "touch",
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-neutral-800 p-6 rounded-2xl shadow-lg flex-shrink-0 w-[calc(100%-2rem)] sm:w-[350px] md:w-[300px] snap-center"
              >
                <div className="text-blue-300 text-4xl font-bold text-center mb-1">"</div>
                <p className="text-base text-center font-normal leading-[22.4px] text-gray-300 mb-4">
                  {testimonial.feedback}
                </p>
                <p className="text-sm text-center text-gray-500">{testimonial.role}</p>
                <p className="font-bold text-center">{testimonial.name}</p>
                <div className="w-24 h-24 mx-auto mt-4 relative rounded-full overflow-hidden">
                  <Image
                    fill
                    className="object-cover"
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation controls */}
          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              onClick={scrollToPrev}
              className="p-2 rounded-full bg-neutral-700 hover:bg-neutral-600 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={togglePause}
              className="p-2 rounded-full bg-neutral-700 hover:bg-neutral-600 transition-colors"
              aria-label={isPaused ? "Play carousel" : "Pause carousel"}
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>

            <button
              onClick={scrollToNext}
              className="p-2 rounded-full bg-neutral-700 hover:bg-neutral-600 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-4 gap-2 flex-wrap">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentIndex === index ? "bg-blue-300" : "bg-neutral-600"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PeopleWhatSay

