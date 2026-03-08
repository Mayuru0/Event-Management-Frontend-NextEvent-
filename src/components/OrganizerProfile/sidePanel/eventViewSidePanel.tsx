"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  Calendar, Camera, MapPin, PencilIcon, Trash2, X,
  CheckCircle2, DollarSign, Users, ImageIcon, Upload,
  ChevronRight, Archive, RotateCcw, Tag,
} from "lucide-react";
import { Event } from "@/type/EventType";
import { useUpdateEventMutation, useDeleteEventMutation } from "@/Redux/features/eventApiSlice";
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

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Published: { bg: "bg-teal-500/15", text: "text-teal-400", dot: "bg-teal-400" },
  Pending:   { bg: "bg-yellow-500/15", text: "text-yellow-400", dot: "bg-yellow-400" },
  Archived:  { bg: "bg-gray-500/15", text: "text-gray-400", dot: "bg-gray-400" },
  Rejected:  { bg: "bg-red-500/15", text: "text-red-400", dot: "bg-red-400" },
};

interface RightSidebarProps {
  event: Event;
  onClose: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ event, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Event>({ ...event });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const isArchived = formData.status === "Archived";
  const currentImage = imagePreview || (formData.image?.startsWith("http") ? formData.image : null);
  const potentialRevenue = formData.ticket_price * formData.quantity;
  const sc = statusConfig[formData.status as string] ?? statusConfig["Pending"];

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
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleArchiveToggle = async () => {
    const newStatus = isArchived ? "Published" : "Archived";
    const fd = new FormData();
    fd.append("status", newStatus);
    try {
      await updateEvent({ eventId: event._id, formData: fd }).unwrap();
      setFormData((prev) => ({ ...prev, status: newStatus }));
      Swal.fire({
        icon: "success",
        title: `Event ${newStatus}`,
        text: `Event has been ${newStatus.toLowerCase()} successfully.`,
        timer: 1500,
        showConfirmButton: false,
        background: "#111",
        color: "#fff",
      });
    } catch {
      Swal.fire({ icon: "error", title: "Failed to update status", background: "#111", color: "#fff" });
    }
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

  const handleSave = async () => {
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
        text: "Changes have been saved.",
        timer: 1500,
        showConfirmButton: false,
        background: "#111",
        color: "#fff",
      });
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
    } catch {
      Swal.fire({ icon: "error", title: "Update Failed", text: "Something went wrong.", background: "#111", color: "#fff" });
    }
  };

  const handleDiscard = () => {
    setFormData({ ...event });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Event?",
      text: "This action cannot be undone. All associated data will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6200EE",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      background: "#111",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await deleteEvent(event._id).unwrap();
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "The event has been removed.",
          timer: 1500,
          showConfirmButton: false,
          background: "#111",
          color: "#fff",
        });
        onClose();
      } catch {
        Swal.fire({ icon: "error", title: "Delete Failed", text: "Something went wrong.", background: "#111", color: "#fff" });
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={isEditing ? undefined : onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-screen w-full max-w-[580px] z-50 bg-[#111] text-white flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#1E1E1E] shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className={`w-1.5 h-5 rounded-full ${isEditing ? "bg-[#6200EE]" : "bg-[#03DAC6]"}`} />
              <h2 className="text-lg font-bold tracking-tight">
                {isEditing ? "Edit Event" : "Event Details"}
              </h2>
            </div>
            <p className="text-[#555] text-xs ml-3.5">
              {isEditing ? "Make changes and save below" : "View and manage this event"}
            </p>
          </div>
          <button
            onClick={isEditing ? handleDiscard : onClose}
            className="p-2 rounded-lg hover:bg-[#1E1E1E] text-[#555] hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">

          {/* Status + Archive row */}
          <div className="flex items-center gap-3">
            {/* Status badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              {formData.status}
            </div>

            <div className="flex-1" />

            {/* Archive toggle */}
            <button
              type="button"
              onClick={handleArchiveToggle}
              disabled={isUpdating}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                isArchived
                  ? "border-teal-600/40 bg-teal-600/10 text-teal-400 hover:bg-teal-600/20"
                  : "border-[#2A2A2A] bg-[#0D0D0D] text-[#888] hover:border-[#444] hover:text-white"
              } disabled:opacity-50`}
            >
              {isArchived ? (
                <><RotateCcw className="w-3.5 h-3.5" /> Re-publish</>
              ) : (
                <><Archive className="w-3.5 h-3.5" /> Archive</>
              )}
            </button>
          </div>

          {/* Event Image */}
          <div>
            <label className={labelCls}>Event Image</label>
            {isEditing ? (
              currentImage ? (
                <div className="relative rounded-xl overflow-hidden">
                  <Image src={currentImage} alt={formData.title} width={600} height={240}
                    className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-red-500/80 text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-xs text-white/70">
                      {imageFile ? imageFile.name : "Current image"}
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      <Camera className="w-3 h-3" /> Replace
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault(); setDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file?.type.startsWith("image/")) processFile(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                    dragOver ? "border-[#6200EE] bg-[#6200EE]/5" : "border-[#2A2A2A] bg-[#0D0D0D] hover:border-[#444]"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#1E1E1E] flex items-center justify-center mx-auto mb-3">
                    <ImageIcon className="w-6 h-6 text-[#555]" />
                  </div>
                  <p className="text-white text-sm font-medium mb-1">
                    {dragOver ? "Drop to upload" : "Drag & drop or click"}
                  </p>
                  <p className="text-[#555] text-xs">PNG, JPG or JPEG · Max 10MB</p>
                  <div className="flex items-center justify-center gap-1 mt-3">
                    <Upload className="w-3 h-3 text-[#6200EE]" />
                    <span className="text-[#6200EE] text-xs font-medium">Browse files</span>
                  </div>
                </div>
              )
            ) : (
              currentImage ? (
                <div className="relative w-full h-52 rounded-xl overflow-hidden">
                  <Image src={currentImage} alt={formData.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              ) : (
                <div className="w-full h-32 rounded-xl bg-[#0D0D0D] border border-[#1E1E1E] flex items-center justify-center">
                  <div className="text-center text-[#555]">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                    <p className="text-xs">No image</p>
                  </div>
                </div>
              )
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          {/* Title */}
          <div>
            <label className={labelCls}>Event Title</label>
            {isEditing ? (
              <>
                <input type="text" name="title" value={formData.title} onChange={handleChange}
                  placeholder="Event title" className={inputCls} />
                {errors.title && <p className="text-red-400 text-xs mt-1.5">{errors.title}</p>}
              </>
            ) : (
              <p className="text-white font-bold text-xl leading-tight">{formData.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            {isEditing ? (
              <>
                <textarea name="description" value={formData.description || ""} onChange={handleChange}
                  rows={4} placeholder="Describe your event..." className={`${inputCls} resize-none`} />
                {errors.description && <p className="text-red-400 text-xs mt-1.5">{errors.description}</p>}
              </>
            ) : (
              <p className="text-[#888] text-sm leading-relaxed">{formData.description || "—"}</p>
            )}
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date</label>
              {isEditing ? (
                <>
                  <div className="relative">
                    <input type="date" name="date" ref={dateInputRef}
                      value={formData.date ? formData.date.split("T")[0] : ""}
                      onChange={handleChange}
                      className={`${inputCls} pr-10`}
                      style={{ colorScheme: "dark" }}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] cursor-pointer"
                      onClick={() => dateInputRef.current?.showPicker()} />
                  </div>
                  {errors.date && <p className="text-red-400 text-xs mt-1.5">{errors.date}</p>}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0D0D0D] border border-[#1E1E1E] flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[#6200EE]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {new Date(formData.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <p className="text-[#555] text-xs">
                      {new Date(formData.date).toLocaleDateString("en-US", { weekday: "long" })}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className={labelCls}>Location</label>
              {isEditing ? (
                <>
                  <div className="relative">
                    <input type="text" name="location" value={formData.location} onChange={handleChange}
                      placeholder="City, Venue" className={`${inputCls} pr-10`} />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                  </div>
                  {errors.location && <p className="text-red-400 text-xs mt-1.5">{errors.location}</p>}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0D0D0D] border border-[#1E1E1E] flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#03DAC6]" />
                  </div>
                  <p className="text-white text-sm font-medium">{formData.location}</p>
                </div>
              )}
            </div>
          </div>

          {/* Event Type */}
          <div>
            <label className={labelCls}>Event Type</label>
            {isEditing ? (
              <>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {EVENT_TYPES.map(({ label, emoji }) => {
                    const isSelected = formData.event_type === label;
                    return (
                      <button key={label} type="button"
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
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0D0D0D] border border-[#1E1E1E] flex items-center justify-center">
                  <Tag className="w-4 h-4 text-[#888]" />
                </div>
                <span className="text-sm font-medium text-white">{formData.event_type}</span>
              </div>
            )}
          </div>

          {/* Pricing & Capacity */}
          <div>
            <label className={labelCls}>Pricing & Capacity</label>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6200EE] font-bold text-sm">$</span>
                    <input type="number" name="ticket_price" value={formData.ticket_price || ""} onChange={handleChange}
                      min={1} placeholder="0.00" className={`${inputCls} pl-7`} />
                  </div>
                  {errors.ticket_price && <p className="text-red-400 text-xs mt-1.5">{errors.ticket_price}</p>}
                  <p className="text-[#555] text-xs mt-1">Price per ticket</p>
                </div>
                <div>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                    <input type="number" name="quantity" value={formData.quantity || ""} onChange={handleChange}
                      min={1} placeholder="0" className={`${inputCls} pl-9`} />
                  </div>
                  {errors.quantity && <p className="text-red-400 text-xs mt-1.5">{errors.quantity}</p>}
                  <p className="text-[#555] text-xs mt-1">Total capacity</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#1E1E1E]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <DollarSign className="w-3.5 h-3.5 text-[#555]" />
                    <span className="text-[#555] text-xs">Per Ticket</span>
                  </div>
                  <p className="text-white font-bold text-2xl">${formData.ticket_price}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#1E1E1E]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Users className="w-3.5 h-3.5 text-[#555]" />
                    <span className="text-[#555] text-xs">Capacity</span>
                  </div>
                  <p className="text-white font-bold text-2xl">{formData.quantity}</p>
                </div>
              </div>
            )}
          </div>

          {/* Potential Revenue */}
          <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#1E1E1E]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#888] text-xs">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Potential Revenue</span>
              </div>
              <span className="text-[#03DAC6] font-bold text-lg">
                ${potentialRevenue.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-[#1E1E1E] shrink-0">
          {isEditing ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDiscard}
                className="flex-1 bg-[#1E1E1E] hover:bg-[#2A2A2A] text-[#888] hover:text-white rounded-xl py-3 text-sm font-semibold transition-all duration-200"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isUpdating}
                className="flex-1 flex items-center justify-center gap-2 bg-[#6200EE] hover:bg-[#4B00D1] text-white rounded-xl py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save Changes
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#6200EE] hover:bg-[#4B00D1] text-white rounded-xl py-3 text-sm font-semibold transition-all duration-200"
              >
                <PencilIcon className="w-4 h-4" />
                Edit Event
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
