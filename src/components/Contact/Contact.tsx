"use client"
import React, { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import DustParticles from "@/components/common/DustParticles"
import { Mail, Phone, Facebook, Linkedin, Instagram, X, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useCreateContactMutation } from "@/Redux/features/contactApiSlice"

interface FormData {
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  subject: string
  reason: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  contactNumber?: string
  subject?: string
  reason?: string
}

const initialForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  contactNumber: "",
  subject: "",
  reason: "",
}

function Contact() {
  const [formData, setFormData] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const [createContact, { isLoading }] = useCreateContactMutation()

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address"
    }
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required"
    } else if (!/^[+]?[\d\s\-]{7,15}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Enter a valid contact number"
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required"
    if (!formData.reason.trim()) {
      newErrors.reason = "Message is required"
    } else if (formData.reason.trim().length < 10) {
      newErrors.reason = "Message must be at least 10 characters"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (errors[id as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await createContact(formData).unwrap()
      setSubmitStatus("success")
      setFormData(initialForm)
      setErrors({})
      setTimeout(() => setSubmitStatus("idle"), 6000)
    } catch {
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus("idle"), 5000)
    }
  }

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-4 py-2.5 bg-[#1A1A28] border rounded-lg text-white placeholder:text-gray-600 text-sm focus:outline-none focus:ring-1 transition-colors ${
      errors[field]
        ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20"
        : "border-white/8 focus:border-[#6200EE]/50 focus:ring-[#6200EE]/25"
    }`

  return (
    <div className="relative bg-[#0A0A0F] py-24 px-6 md:px-12 overflow-hidden">
      <DustParticles count={50} />

      {/* Decorative orbs */}
      <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-[#6200EE]/8 blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-[#03DAC6]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#6200EE]/30 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6200EE]/30 bg-[#6200EE]/10 text-[#03DAC6] text-xs font-semibold tracking-widest uppercase mb-6">
            Contact
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6200EE] to-[#03DAC6]">Touch</span>
          </h2>
          <p className="text-gray-500 text-base mt-4 max-w-xl mx-auto">
            Have a question or want to work with us? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src="/images/contactImage.png"
                alt="Contact"
                width={700}
                height={500}
                className="w-full h-[280px] md:h-[340px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-black/30 to-transparent" />
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#111118] border border-white/8 rounded-xl p-5 hover:border-[#6200EE]/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#6200EE]/15 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#03DAC6]" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">Chat with Us</h3>
                </div>
                <p className="text-gray-600 text-xs mb-1.5">Our friendly team is here</p>
                <p className="text-[#03DAC6] text-sm font-medium">nextEvents@hotmail.com</p>
              </div>

              <div className="bg-[#111118] border border-white/8 rounded-xl p-5 hover:border-[#6200EE]/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#6200EE]/15 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-[#03DAC6]" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">Call Us</h3>
                </div>
                <p className="text-gray-600 text-xs mb-1.5">Mon – Fri, 8am to 5pm</p>
                <p className="text-[#03DAC6] text-sm font-medium">+64 3322 83773</p>
              </div>
            </div>

            {/* Social */}
            <div className="bg-[#111118] border border-white/8 rounded-xl p-5">
              <h3 className="font-semibold text-white text-sm mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[Facebook, Linkedin, Instagram, X].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-lg bg-[#1A1A28] border border-white/8 flex items-center justify-center text-gray-500 hover:text-white hover:border-[#6200EE]/40 hover:bg-[#6200EE]/15 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-[#111118] border border-white/8 rounded-2xl p-6 md:p-8"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-1">Send a Message</h3>
              <p className="text-gray-500 text-sm">We&apos;ll get back to you within 24 hours.</p>
            </div>

            {/* Success / Error banners */}
            <AnimatePresence>
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-5 flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-emerald-400 text-sm font-semibold">Message sent!</p>
                    <p className="text-emerald-500/70 text-xs mt-0.5">We&apos;ll get back to you within 24 hours.</p>
                  </div>
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-5 flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-red-400 text-sm font-semibold">Failed to send</p>
                    <p className="text-red-500/70 text-xs mt-0.5">Something went wrong. Please try again.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-medium text-gray-400 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClass("firstName")}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs font-medium text-gray-400 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={inputClass("lastName")}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass("email")}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label htmlFor="contactNumber" className="block text-xs font-medium text-gray-400 mb-1.5">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={inputClass("contactNumber")}
                  placeholder="+64 3322 83773"
                />
                {errors.contactNumber && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.contactNumber}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-xs font-medium text-gray-400 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClass("subject")}
                  placeholder="Refund Event Ticket"
                />
                {errors.subject && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.subject}
                  </p>
                )}
              </div>

              {/* Message / Reason */}
              <div>
                <label htmlFor="reason" className="block text-xs font-medium text-gray-400 mb-1.5">
                  Message
                </label>
                <textarea
                  id="reason"
                  rows={4}
                  value={formData.reason}
                  onChange={handleChange}
                  className={`${inputClass("reason")} resize-none`}
                  placeholder="Type your message here..."
                />
                {errors.reason && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.reason}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6200EE] to-[#7B2FFF] hover:from-[#7B2FFF] hover:to-[#9040FF] text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-purple-900/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact
