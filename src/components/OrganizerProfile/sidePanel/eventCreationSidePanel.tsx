"use client";

import React, { useRef, useState } from "react";
import {
  X,
  ImagePlus,
  CalendarDays,
  MapPin,
  Tag,
  Ticket,
  Hash,
  AlignLeft,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { useCreateEventMutation } from "@/Redux/features/eventApiSlice";
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";
import { Event } from "@/type/EventType";

interface Props {
  onClose: () => void;
}

const EVENT_TYPES = [
  { value: "Indoor Musical Concert", label: "Indoor Musical Concert", emoji: "🎵" },
  { value: "Outdoor Musical Concert", label: "Outdoor Musical Concert", emoji: "🎶" },
  { value: "Standup Comedy show", label: "Standup Comedy Show", emoji: "🎤" },
  { value: "Meetup", label: "Meetup", emoji: "🤝" },
  { value: "Musical", label: "Musical", emoji: "🎭" },
];

const STEPS = ["Details", "Pricing", "Media"];

/* ── shared input class ── */
const inputCls =
  "w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#6200EE] focus:ring-1 focus:ring-[#6200EE]/50 transition-all duration-200 text-sm";

const labelCls = "block text-xs font-semibold uppercase tracking-widest text-[#888] mb-2";

export default function EventCreationSidePanel({ onClose }: Props) {
  const user = useSelector(selectuser);
  const organizerid =
    user?.role === "organizer" || user?.role === "admin" ? user?._id ?? "" : "";

  const [step, setStep] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Event>({
    _id: "",
    organizerid,
    title: "",
    ticket_price: 0,
    description: "",
    date: "",
    event_type: "",
    image: "",
    location: "",
    popularity: 10,
    quantity: 0,
    status: "Pending",
    createdAt: "",
    updatedAt: "",
  });

  const [createEvent, { isLoading }] = useCreateEventMutation();

  const set = (field: keyof Event, value: string | number) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!formData.title.trim()) e.title = "Title is required";
      if (!formData.description.trim()) e.description = "Description is required";
      if (!formData.date) e.date = "Date is required";
      if (!formData.location.trim()) e.location = "Location is required";
      if (!formData.event_type) e.event_type = "Event type is required";
    }
    if (step === 1) {
      if (!formData.ticket_price || formData.ticket_price <= 0)
        e.ticket_price = "Enter a valid price";
      if (!formData.quantity || formData.quantity <= 0)
        e.quantity = "Enter a valid quantity";
    }
    if (step === 2) {
      if (!imageFile) e.image = "Event image is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleImage = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((p) => ({ ...p, image: "" }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImage(file);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    const fd = new FormData();
    fd.append("organizerid", organizerid);
    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("date", formData.date);
    fd.append("location", formData.location);
    fd.append("event_type", formData.event_type);
    fd.append("ticket_price", String(formData.ticket_price));
    fd.append("quantity", String(formData.quantity));
    fd.append("popularity", "10");
    fd.append("status", "Pending");
    if (imageFile) fd.append("image", imageFile);

    try {
      await createEvent(fd).unwrap();
      setStep(3); // success screen
    } catch {
      setErrors({ submit: "Failed to create event. Please try again." });
    }
  };

  const totalRevenue = formData.ticket_price * formData.quantity;

  /* ──────────────── RENDER ──────────────── */
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-[520px] z-50 flex flex-col bg-[#111] border-l border-[#1E1E1E] shadow-2xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E1E1E] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6200EE]/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#6200EE]" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-tight">Create New Event</h2>
              <p className="text-[#555] text-xs">Submitted for admin approval</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#555] hover:text-white hover:bg-[#1E1E1E] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Step Progress ── */}
        {step < 3 && (
          <div className="px-6 pt-5 pb-4 shrink-0">
            <div className="flex items-center gap-0">
              {STEPS.map((label, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        i < step
                          ? "bg-[#6200EE] text-white"
                          : i === step
                          ? "bg-[#6200EE]/20 border-2 border-[#6200EE] text-[#6200EE]"
                          : "bg-[#1E1E1E] text-[#555]"
                      }`}
                    >
                      {i < step ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        i === step ? "text-[#6200EE]" : i < step ? "text-white" : "text-[#555]"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-[2px] mx-2 mb-4 rounded-full transition-all duration-500 ${
                        i < step ? "bg-[#6200EE]" : "bg-[#1E1E1E]"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2A2A2A]">

          {/* ─ STEP 0 : Details ─ */}
          {step === 0 && (
            <>
              {/* Title */}
              <div>
                <label className={labelCls}>
                  <AlignLeft className="inline w-3 h-3 mr-1" /> Event Title
                </label>
                <input
                  className={`${inputCls} ${errors.title ? "border-red-500/60" : ""}`}
                  placeholder="e.g. Summer Music Festival 2025"
                  value={formData.title}
                  onChange={(e) => set("title", e.target.value)}
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>
                  <AlignLeft className="inline w-3 h-3 mr-1" /> Description
                </label>
                <textarea
                  rows={4}
                  className={`${inputCls} resize-none ${errors.description ? "border-red-500/60" : ""}`}
                  placeholder="Tell attendees what to expect..."
                  value={formData.description}
                  onChange={(e) => set("description", e.target.value)}
                />
                <div className="flex justify-between mt-1">
                  {errors.description
                    ? <p className="text-red-400 text-xs">{errors.description}</p>
                    : <span />}
                  <span className="text-[#555] text-xs">{formData.description.length} chars</span>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className={labelCls}>
                  <CalendarDays className="inline w-3 h-3 mr-1" /> Event Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    ref={dateInputRef}
                    className={`${inputCls} pr-10 [color-scheme:dark] ${errors.date ? "border-red-500/60" : ""}`}
                    value={formData.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => set("date", e.target.value)}
                  />
                  <CalendarDays
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] cursor-pointer"
                    onClick={() => dateInputRef.current?.showPicker()}
                  />
                </div>
                {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
              </div>

              {/* Location */}
              <div>
                <label className={labelCls}>
                  <MapPin className="inline w-3 h-3 mr-1" /> Venue / Location
                </label>
                <div className="relative">
                  <input
                    className={`${inputCls} pr-10 ${errors.location ? "border-red-500/60" : ""}`}
                    placeholder="e.g. Madison Square Garden, New York"
                    value={formData.location}
                    onChange={(e) => set("location", e.target.value)}
                  />
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                </div>
                {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
              </div>

              {/* Event Type */}
              <div>
                <label className={labelCls}>
                  <Tag className="inline w-3 h-3 mr-1" /> Event Category
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {EVENT_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => {
                        set("event_type", t.value);
                        setErrors((p) => ({ ...p, event_type: "" }));
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 text-left ${
                        formData.event_type === t.value
                          ? "border-[#6200EE] bg-[#6200EE]/10 text-white"
                          : "border-[#2A2A2A] bg-[#0D0D0D] text-[#888] hover:border-[#333] hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{t.emoji}</span>
                      {t.label}
                      {formData.event_type === t.value && (
                        <CheckCircle2 className="w-4 h-4 text-[#6200EE] ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
                {errors.event_type && <p className="text-red-400 text-xs mt-1">{errors.event_type}</p>}
              </div>
            </>
          )}

          {/* ─ STEP 1 : Pricing ─ */}
          {step === 1 && (
            <>
              <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl p-5 space-y-5">
                <p className="text-[#888] text-xs font-semibold uppercase tracking-widest">Ticket Configuration</p>

                {/* Price */}
                <div>
                  <label className={labelCls}>
                    <Ticket className="inline w-3 h-3 mr-1" /> Ticket Price (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555] font-bold text-sm">$</span>
                    <input
                      type="number"
                      min={1}
                      className={`${inputCls} pl-8 ${errors.ticket_price ? "border-red-500/60" : ""}`}
                      placeholder="0.00"
                      value={formData.ticket_price || ""}
                      onChange={(e) => set("ticket_price", Number(e.target.value))}
                    />
                  </div>
                  {errors.ticket_price && <p className="text-red-400 text-xs mt-1">{errors.ticket_price}</p>}
                </div>

                {/* Quantity */}
                <div>
                  <label className={labelCls}>
                    <Hash className="inline w-3 h-3 mr-1" /> Total Tickets Available
                  </label>
                  <input
                    type="number"
                    min={1}
                    className={`${inputCls} ${errors.quantity ? "border-red-500/60" : ""}`}
                    placeholder="e.g. 500"
                    value={formData.quantity || ""}
                    onChange={(e) => set("quantity", Number(e.target.value))}
                  />
                  {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity}</p>}
                </div>
              </div>

              {/* Revenue Preview */}
              {totalRevenue > 0 && (
                <div className="bg-gradient-to-br from-[#6200EE]/10 to-[#03DAC6]/5 border border-[#6200EE]/20 rounded-2xl p-5">
                  <p className="text-[#888] text-xs font-semibold uppercase tracking-widest mb-3">Revenue Preview</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-[#555] text-xs mb-1">Per Ticket</p>
                      <p className="text-white font-bold text-lg">${formData.ticket_price}</p>
                    </div>
                    <div>
                      <p className="text-[#555] text-xs mb-1">Capacity</p>
                      <p className="text-white font-bold text-lg">{formData.quantity}</p>
                    </div>
                    <div>
                      <p className="text-[#555] text-xs mb-1">Potential</p>
                      <p className="text-[#03DAC6] font-bold text-lg">
                        ${totalRevenue >= 1000
                          ? `${(totalRevenue / 1000).toFixed(1)}K`
                          : totalRevenue}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ─ STEP 2 : Media ─ */}
          {step === 2 && (
            <>
              <div>
                <label className={labelCls}>
                  <ImagePlus className="inline w-3 h-3 mr-1" /> Event Cover Image
                </label>

                {!imagePreview ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
                      isDragging
                        ? "border-[#6200EE] bg-[#6200EE]/10 scale-[1.01]"
                        : errors.image
                        ? "border-red-500/50 bg-red-500/5"
                        : "border-[#2A2A2A] hover:border-[#6200EE]/50 hover:bg-[#6200EE]/5"
                    }`}
                  >
                    <ImagePlus className={`w-10 h-10 mx-auto mb-3 ${isDragging ? "text-[#6200EE]" : "text-[#444]"}`} />
                    <p className="text-white font-semibold text-sm mb-1">
                      {isDragging ? "Drop it here!" : "Drag & drop or click to upload"}
                    </p>
                    <p className="text-[#555] text-xs">PNG, JPG, JPEG — max 10MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
                    />
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-[#2A2A2A]">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={480}
                      height={240}
                      className="w-full h-52 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#03DAC6]" />
                        <span className="text-white text-xs font-medium">{imageFile?.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                        className="w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>
                )}
                {errors.image && <p className="text-red-400 text-xs mt-2">{errors.image}</p>}
              </div>

              {/* Summary Card */}
              <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl p-4 space-y-3">
                <p className="text-[#888] text-xs font-semibold uppercase tracking-widest">Event Summary</p>
                <div className="space-y-2">
                  {[
                    { label: "Title", value: formData.title },
                    { label: "Date", value: formData.date ? new Date(formData.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "—" },
                    { label: "Location", value: formData.location },
                    { label: "Type", value: formData.event_type },
                    { label: "Price", value: `$${formData.ticket_price} × ${formData.quantity} tickets` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start gap-4">
                      <span className="text-[#555] text-xs shrink-0">{label}</span>
                      <span className="text-white text-xs text-right font-medium truncate">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm">{errors.submit}</p>
                </div>
              )}
            </>
          )}

          {/* ─ STEP 3 : Success ─ */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#6200EE]/20 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-10 h-10 text-[#6200EE]" />
              </div>
              <h3 className="text-white font-bold text-xl">Event Submitted!</h3>
              <p className="text-[#888] text-sm max-w-xs leading-relaxed">
                <span className="text-white font-medium">"{formData.title}"</span> has been submitted successfully and is pending admin approval.
              </p>
              <div className="mt-4 w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl p-4 text-left space-y-2">
                <p className="text-[#555] text-xs">What's next?</p>
                {["Admin reviews your event", "You'll be notified once approved", "Tickets go live for sale"].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#6200EE]/20 text-[#6200EE] text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</div>
                    <span className="text-[#888] text-xs">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-[#1E1E1E] shrink-0">
          {step === 3 ? (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#6200EE] hover:bg-[#4B00D1] text-white font-semibold text-sm transition-all duration-200"
            >
              Done
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={step === 0 ? onClose : () => setStep((s) => s - 1)}
                className="flex-1 py-3 rounded-xl border border-[#2A2A2A] text-[#888] hover:text-white hover:border-[#444] font-semibold text-sm transition-all duration-200"
              >
                {step === 0 ? "Cancel" : "Back"}
              </button>
              <button
                onClick={step === 2 ? handleSubmit : handleNext}
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl bg-[#6200EE] hover:bg-[#4B00D1] text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : step === 2 ? "Create Event" : "Continue →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
