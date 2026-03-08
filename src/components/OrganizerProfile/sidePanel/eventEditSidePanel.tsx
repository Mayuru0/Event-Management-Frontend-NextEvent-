"use client";

import React, { useRef, useState } from "react";
import { Upload, Calendar, X, MapPin, DollarSign, Users, ImageIcon, CheckCircle2, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Event } from "@/type/EventType";
import { useUpdateEventMutation } from "@/Redux/features/eventApiSlice";
import Swal from "sweetalert2";

const EVENT_TYPES = [
  { label: "Indoor Concert", emoji: "🎵" },
  { label: "Outdoor Concert", emoji: "🎸" },
  { label: "Standup Comedy", emoji: "🎤" },
  { label: "Meetup", emoji: "🤝" },
  { label: "Musical", emoji: "🎭" },
];

const inputCls =
  "w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#6200EE] focus:ring-1 focus:ring-[#6200EE]/50 transition-all duration-200 text-sm";
const labelCls = "block text-xs font-semibold uppercase tracking-widest text-[#888] mb-2";

interface EventEditSidePanelProps {
  event: Event;
  onClose: () => void;
}

const EventEditSidePanel: React.FC<EventEditSidePanelProps> = ({ event, onClose }) => {
  const [formData, setFormData] = useState<Event>({ ...event });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [updateEvent, { isLoading }] = useUpdateEventMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const processFile = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) processFile(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.description?.trim()) newErrors.description = "Description is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.event_type) newErrors.event_type = "Event type is required.";
    if (!formData.ticket_price || formData.ticket_price <= 0) newErrors.ticket_price = "Must be greater than 0.";
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Must be greater than 0.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("description", formData.description || "");
    fd.append("date", formData.date);
    fd.append("location", formData.location);
    fd.append("ticket_price", String(formData.ticket_price));
    fd.append("quantity", String(formData.quantity));
    fd.append("event_type", formData.event_type);
    fd.append("status", formData.status);
    if (imageFile) fd.append("image", imageFile);

    try {
      await updateEvent({ eventId: event._id, formData: fd }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Event Updated!",
        text: "Your event has been updated successfully.",
        timer: 1500,
        showConfirmButton: false,
        background: "#111",
        color: "#fff",
      });
      onClose();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong. Please try again.",
        background: "#111",
        color: "#fff",
      });
    }
  };

  const currentImage = imagePreview || (event.image?.startsWith("http") ? event.image : null);
  const potentialRevenue = (formData.ticket_price || 0) * (formData.quantity || 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-screen w-full max-w-[580px] z-50 bg-[#111] text-white flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#1E1E1E] shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-1.5 h-5 bg-[#6200EE] rounded-full" />
              <h2 className="text-lg font-bold tracking-tight">Edit Event</h2>
            </div>
            <p className="text-[#555] text-xs ml-3.5">Update the details for this event</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#1E1E1E] text-[#555] hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-7 py-6 space-y-6">

          {/* Title */}
          <div>
            <label className={labelCls}>Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Summer Music Festival 2025"
              className={inputCls}
            />
            {errors.title && <p className="text-red-400 text-xs mt-1.5">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your event..."
              className={`${inputCls} resize-none`}
            />
            {errors.description && <p className="text-red-400 text-xs mt-1.5">{errors.description}</p>}
          </div>

          {/* Date & Location row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  ref={dateInputRef}
                  value={formData.date ? formData.date.split("T")[0] : ""}
                  onChange={handleChange}
                  className={`${inputCls} pr-10`}
                  style={{ colorScheme: "dark" }}
                />
                <Calendar
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] cursor-pointer"
                  onClick={() => dateInputRef.current?.showPicker()}
                />
              </div>
              {errors.date && <p className="text-red-400 text-xs mt-1.5">{errors.date}</p>}
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <div className="relative">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Venue"
                  className={`${inputCls} pr-10`}
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              </div>
              {errors.location && <p className="text-red-400 text-xs mt-1.5">{errors.location}</p>}
            </div>
          </div>

          {/* Event Type */}
          <div>
            <label className={labelCls}>Event Type</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {EVENT_TYPES.map(({ label, emoji }) => {
                const isSelected = formData.event_type === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, event_type: label }));
                      if (errors.event_type) setErrors((prev) => ({ ...prev, event_type: "" }));
                    }}
                    className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all duration-200 ${
                      isSelected
                        ? "border-[#6200EE] bg-[#6200EE]/10 text-white"
                        : "border-[#2A2A2A] bg-[#0D0D0D] text-[#888] hover:border-[#444] hover:text-white"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2 className="absolute top-1.5 right-1.5 w-3 h-3 text-[#6200EE]" />
                    )}
                    <span className="text-xl">{emoji}</span>
                    <span className="text-center leading-tight">{label}</span>
                  </button>
                );
              })}
            </div>
            {errors.event_type && <p className="text-red-400 text-xs mt-1.5">{errors.event_type}</p>}
          </div>

          {/* Pricing */}
          <div>
            <label className={labelCls}>Pricing & Capacity</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6200EE] font-bold text-sm">$</span>
                  <input
                    type="number"
                    name="ticket_price"
                    value={formData.ticket_price || ""}
                    onChange={handleChange}
                    min={1}
                    placeholder="0.00"
                    className={`${inputCls} pl-7`}
                  />
                </div>
                {errors.ticket_price && <p className="text-red-400 text-xs mt-1.5">{errors.ticket_price}</p>}
                <p className="text-[#555] text-xs mt-1">Price per ticket</p>
              </div>
              <div>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity || ""}
                    onChange={handleChange}
                    min={1}
                    placeholder="0"
                    className={`${inputCls} pl-9`}
                  />
                </div>
                {errors.quantity && <p className="text-red-400 text-xs mt-1.5">{errors.quantity}</p>}
                <p className="text-[#555] text-xs mt-1">Total capacity</p>
              </div>
            </div>

            {/* Revenue Preview */}
            {potentialRevenue > 0 && (
              <div className="mt-3 p-4 rounded-xl bg-[#0D0D0D] border border-[#1E1E1E]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#888] text-xs">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Potential Revenue</span>
                  </div>
                  <span className="text-[#03DAC6] font-bold text-base">
                    ${potentialRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelCls}>Event Image</label>

            {currentImage ? (
              <div className="relative rounded-xl overflow-hidden">
                <Image
                  src={currentImage}
                  alt="Event preview"
                  width={600}
                  height={240}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-red-500/80 text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs text-white/80">
                    {imageFile ? imageFile.name : "Current image"}
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition-colors"
                  >
                    Replace
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  dragOver
                    ? "border-[#6200EE] bg-[#6200EE]/5"
                    : "border-[#2A2A2A] bg-[#0D0D0D] hover:border-[#444]"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#1E1E1E] flex items-center justify-center mx-auto mb-3">
                  <ImageIcon className="w-6 h-6 text-[#555]" />
                </div>
                <p className="text-white text-sm font-medium mb-1">
                  {dragOver ? "Drop to upload" : "Drag & drop or click to upload"}
                </p>
                <p className="text-[#555] text-xs">PNG, JPG or JPEG · Max 10MB</p>
                <div className="flex items-center justify-center gap-1 mt-3">
                  <Upload className="w-3 h-3 text-[#6200EE]" />
                  <span className="text-[#6200EE] text-xs font-medium">Browse files</span>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

        </form>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-[#1E1E1E] shrink-0 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[#1E1E1E] hover:bg-[#2A2A2A] text-[#888] hover:text-white rounded-xl py-3 text-sm font-semibold transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            form=""
            disabled={isLoading}
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 bg-[#6200EE] hover:bg-[#4B00D1] text-white rounded-xl py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                Save Changes
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default EventEditSidePanel;
