/* eslint-disable */
"use client"

import type React from "react"
import Image from "next/image"
import { useRef, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Pause, Play, Quote, Star, Trash2, PenLine, X, Loader2, LogIn } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import DustParticles from "@/components/common/DustParticles"
import { useSelector } from "react-redux"
import { selectuser } from "@/Redux/features/authSlice"
import {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  type Review,
} from "@/Redux/features/reviewApiSlice"

// ─── Star Picker ──────────────────────────────────────────────────────────────
const StarPicker = ({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) => {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-7 h-7 transition-colors duration-150 ${
              s <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-gray-600"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

// ─── Review Card ──────────────────────────────────────────────────────────────
const ReviewCard = ({
  review,
  isActive,
  currentUserId,
  onDelete,
  isDeleting,
}: {
  review: Review
  isActive: boolean
  currentUserId?: string
  onDelete: (id: string) => void
  isDeleting: boolean
}) => {
  const isOwner = currentUserId && review.userId === currentUserId

  return (
    <div
      className={`
        relative flex-shrink-0 w-[calc(100%-2rem)] sm:w-[340px] md:w-[320px] snap-center
        bg-[#111118] border rounded-2xl p-6 flex flex-col gap-4
        transition-all duration-300
        ${isActive
          ? "border-[#6200EE]/40 shadow-xl shadow-purple-900/20"
          : "border-white/8 hover:border-[#6200EE]/25"}
      `}
    >
      {/* Active glow */}
      {isActive && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[#6200EE]/80 to-transparent" />
      )}

      {/* Delete button (owner only) */}
      {isOwner && (
        <button
          onClick={() => onDelete(review._id)}
          disabled={isDeleting}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
          title="Delete your review"
        >
          {isDeleting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
        </button>
      )}

      {/* Quote icon */}
      <div className="w-10 h-10 rounded-xl bg-[#6200EE]/12 border border-[#6200EE]/20 flex items-center justify-center flex-shrink-0">
        <Quote className="w-4 h-4 text-[#6200EE]" />
      </div>

      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < review.stars ? "fill-amber-400 text-amber-400" : "fill-transparent text-gray-700"
            }`}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-gray-400 text-sm leading-relaxed flex-1">
        &ldquo;{review.comment}&rdquo;
      </p>

      {/* Divider */}
      <div className="h-px bg-white/5" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className={`
            w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative
            ring-2 ring-offset-2 ring-offset-[#111118]
            ${review.role === "organizer" ? "ring-[#6200EE]/50" : "ring-[#03DAC6]/50"}
          `}
        >
          {review.profilePic ? (
            <Image fill className="object-cover" src={review.profilePic} alt={review.name} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#6200EE]/40 to-[#03DAC6]/30 flex items-center justify-center text-white font-bold text-lg">
              {review.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{review.name}</p>
          <span
            className={`
              inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-0.5
              ${review.role === "organizer"
                ? "bg-[#6200EE]/15 text-[#6200EE] border border-[#6200EE]/20"
                : review.role === "admin"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "bg-[#03DAC6]/10 text-[#03DAC6] border border-[#03DAC6]/20"}
            `}
          >
            {review.role === "organizer"
              ? "Event Organizer"
              : review.role === "admin"
              ? "Admin"
              : "Attendee"}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[340px] md:w-[320px] snap-center bg-[#111118] border border-white/8 rounded-2xl p-6 flex flex-col gap-4 animate-pulse">
    <div className="w-10 h-10 rounded-xl bg-white/5" />
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => <div key={i} className="w-3.5 h-3.5 rounded bg-white/5" />)}
    </div>
    <div className="flex flex-col gap-2 flex-1">
      <div className="h-3 bg-white/5 rounded w-full" />
      <div className="h-3 bg-white/5 rounded w-5/6" />
      <div className="h-3 bg-white/5 rounded w-4/6" />
    </div>
    <div className="h-px bg-white/5" />
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-white/5" />
      <div className="flex flex-col gap-2">
        <div className="h-3 bg-white/5 rounded w-24" />
        <div className="h-3 bg-white/5 rounded w-16" />
      </div>
    </div>
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────
const PeopleWhatSay = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [cardWidth, setCardWidth] = useState(0)
  const [gapWidth, setGapWidth] = useState(0)

  // Write review form state
  const [formOpen, setFormOpen] = useState(false)
  const [stars, setStars] = useState(0)
  const [comment, setComment] = useState("")
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Auth
  const user = useSelector(selectuser)

  // API
  const { data: reviews = [], isLoading, isError } = useGetReviewsQuery()
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation()
  const [deleteReview] = useDeleteReviewMutation()

  // Current user's existing review
  const userReview = user ? reviews.find((r) => r.userId === user._id) : undefined

  // ── Responsive ───────────────────────────────────────────────────────
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
  }, [reviews])

  // ── Auto-scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || isHovering || !cardWidth || reviews.length === 0) return
    const interval = setInterval(() => {
      scrollToIndex((currentIndex + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [currentIndex, isPaused, isHovering, cardWidth, reviews.length])

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
        container.scrollLeft = Math.max(0, (scrollWidth - containerW) * (mouseX / viewportWidth))
      } else if (mouseX > viewportWidth - edgeThreshold) {
        container.scrollLeft = Math.min(scrollWidth - containerW, (scrollWidth - containerW) * (mouseX / viewportWidth))
      }
    }
  }

  const scrollToNext = () => scrollToIndex((currentIndex + 1) % Math.max(reviews.length, 1))
  const scrollToPrev = () => scrollToIndex((currentIndex - 1 + Math.max(reviews.length, 1)) % Math.max(reviews.length, 1))
  const togglePause = () => setIsPaused(!isPaused)

  // ── Submit review ────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setFormSuccess("")
    if (stars === 0) { setFormError("Please select a star rating."); return }
    if (comment.trim().length < 10) { setFormError("Comment must be at least 10 characters."); return }
    try {
      await createReview({ stars, comment: comment.trim() }).unwrap()
      setFormSuccess("Your review has been submitted!")
      setStars(0)
      setComment("")
      setFormOpen(false)
      setTimeout(() => setFormSuccess(""), 5000)
    } catch (err: any) {
      setFormError(err?.data?.message || "Failed to submit review. Please try again.")
    }
  }

  // ── Delete review ────────────────────────────────────────────────────
  const handleDelete = async (reviewId: string) => {
    setDeletingId(reviewId)
    try {
      await deleteReview(reviewId).unwrap()
    } catch (err: any) {
      console.error("Delete failed:", err)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="relative bg-[#0A0A0F] text-white py-24 overflow-hidden">
      <DustParticles count={45} />

      {/* Decorative orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#6200EE]/35 to-transparent" />
      <div className="absolute top-12 left-1/4 w-80 h-80 rounded-full bg-[#6200EE]/7 blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-80 h-80 rounded-full bg-[#03DAC6]/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-6">

        {/* ── Header ── */}
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
            Hear from our amazing community of event organizers and attendees. Real feedback from real people.
          </p>
        </motion.div>

        {/* ── Write a Review CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center mb-10"
        >
          {!user ? (
            <a
              href="/signin"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111118] border border-white/10 text-gray-400 hover:text-white hover:border-[#6200EE]/40 transition-all duration-300 text-sm"
            >
              <LogIn className="w-4 h-4" />
              Sign in to write a review
            </a>
          ) : userReview ? (
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              You&apos;ve already submitted a review. Delete it below to write a new one.
            </p>
          ) : (
            <button
              onClick={() => setFormOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6200EE] to-[#5000C9] text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-900/30 transition-all duration-300"
            >
              <PenLine className="w-4 h-4" />
              {formOpen ? "Cancel" : "Write a Review"}
            </button>
          )}
        </motion.div>

        {/* ── Write Review Form ── */}
        <AnimatePresence>
          {formOpen && user && !userReview && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <form
                onSubmit={handleSubmit}
                className="max-w-xl mx-auto bg-[#111118] border border-white/8 rounded-2xl p-6 flex flex-col gap-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-base">Share your experience</h3>
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Star picker */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Rating</label>
                  <StarPicker value={stars} onChange={setStars} />
                </div>

                {/* Comment */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                    Your Review
                    <span className="ml-2 text-gray-600 normal-case tracking-normal">({comment.trim().length}/500)</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value.slice(0, 500))}
                    placeholder="Tell others about your experience with NextEvent…"
                    rows={4}
                    className="w-full bg-[#0A0A0F] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#6200EE]/50 resize-none transition-colors"
                  />
                </div>

                {/* Error / success */}
                <AnimatePresence>
                  {formError && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                    >
                      {formError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6200EE] to-[#5000C9] text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-900/30 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Success banner ── */}
        <AnimatePresence>
          {formSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="max-w-xl mx-auto mb-8 px-4 py-3 rounded-xl bg-[#03DAC6]/10 border border-[#03DAC6]/25 text-[#03DAC6] text-sm text-center"
            >
              {formSuccess}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Carousel ── */}
        <div className="relative">
          {/* Left / Right fades */}
          <div className="absolute left-0 top-0 bottom-6 w-12 bg-gradient-to-r from-[#0A0A0F] to-transparent z-10 pointer-events-none rounded-l-2xl" />
          <div className="absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-[#0A0A0F] to-transparent z-10 pointer-events-none rounded-r-2xl" />

          {/* Loading skeletons */}
          {isLoading && (
            <div className="flex overflow-x-hidden gap-5 md:gap-6 pb-4">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error state */}
          {isError && !isLoading && (
            <div className="text-center py-16 text-gray-500">
              <p>Could not load reviews. Please try again later.</p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && reviews.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#6200EE]/10 border border-[#6200EE]/20 flex items-center justify-center mx-auto mb-4">
                <Star className="w-7 h-7 text-[#6200EE]" />
              </div>
              <p className="text-white font-semibold text-lg mb-1">No reviews yet</p>
              <p className="text-gray-500 text-sm">Be the first to share your experience!</p>
            </motion.div>
          )}

          {/* Reviews carousel */}
          {!isLoading && !isError && reviews.length > 0 && (
            <>
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-5 md:gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
                style={{ WebkitOverflowScrolling: "touch" }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onMouseMove={handleMouseMove}
                onTouchStart={() => setIsPaused(true)}
              >
                {reviews.map((review, index) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    isActive={currentIndex === index}
                    currentUserId={user?._id}
                    onDelete={handleDelete}
                    isDeleting={deletingId === review._id}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-5 mt-8">
                <button
                  onClick={scrollToPrev}
                  aria-label="Previous"
                  className="w-9 h-9 rounded-full bg-[#111118] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#6200EE]/40 hover:bg-[#6200EE]/15 transition-all duration-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Dot indicators */}
                <div className="flex items-center gap-2">
                  {reviews.map((_, i) => (
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

                <button
                  onClick={scrollToNext}
                  aria-label="Next"
                  className="w-9 h-9 rounded-full bg-[#111118] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#6200EE]/40 hover:bg-[#6200EE]/15 transition-all duration-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default PeopleWhatSay
