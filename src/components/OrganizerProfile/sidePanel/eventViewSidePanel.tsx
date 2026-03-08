"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Calendar, Camera, MapPin, PencilIcon, Trash2, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Event } from "@/type/EventType";
import { useUpdateEventMutation, useDeleteEventMutation } from "@/Redux/features/eventApiSlice";
import Swal from "sweetalert2";

interface RightSidebarProps {
  event: Event;
  onClose: () => void;
}

const EVENT_TYPES = [
  "Indoor Musical Concert",
  "Outdoor Musical Concert",
  "Standup Comedy show",
  "Meetup",
  "Musical",
];

const RightSidebar: React.FC<RightSidebarProps> = ({ event, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Event>({ ...event });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const isArchived = formData.status === "Archived";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
      });
    } catch {
      Swal.fire({ icon: "error", title: "Failed to update status" });
    }
  };

  const handleSave = async () => {
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
        text: "Changes have been saved successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
    } catch {
      Swal.fire({ icon: "error", title: "Update Failed", text: "Something went wrong. Please try again." });
    }
  };

  const handleDiscard = () => {
    setFormData({ ...event });
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Event?",
      text: "This action cannot be undone. All associated data will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CF6679",
      cancelButtonColor: "#6200EE",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteEvent(event._id).unwrap();
        Swal.fire({
          icon: "success",
          title: "Event Deleted",
          text: "The event has been deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        onClose();
      } catch {
        Swal.fire({ icon: "error", title: "Delete Failed", text: "Something went wrong. Please try again." });
      }
    }
  };

  const currentImage = imagePreview || (formData.image && formData.image.startsWith("http") ? formData.image : null);

  return (
    <div className="w-full max-w-[600px] fixed top-0 right-0 h-screen z-50 bg-[#121212] text-white border-l border-gray-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800 shrink-0">
        <div>
          <h2 className="text-2xl font-bold font-raleway">
            {isEditing ? "Edit Event" : "Event Details"}
          </h2>
          <p className="text-[#B0B0B0] font-normal text-sm font-kulim mt-1">
            {isEditing ? "Update event information below." : "View and manage this event."}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Archive Toggle */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-[#1F1F1F]">
          <Switch
            checked={isArchived}
            onCheckedChange={handleArchiveToggle}
            disabled={isUpdating}
          />
          <div>
            <p className="font-semibold text-white font-raleway">
              {isArchived ? "Archived" : "Active"} Event
            </p>
            <p className="text-xs text-[#B0B0B0]">
              Toggle to {isArchived ? "re-publish" : "archive"} this event
            </p>
          </div>
          <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${
            formData.status === "Published" ? "bg-teal-600 text-white"
            : formData.status === "Pending" ? "bg-yellow-500 text-black"
            : formData.status === "Archived" ? "bg-gray-600 text-white"
            : "bg-red-600 text-white"
          }`}>
            {formData.status}
          </span>
        </div>

        {/* Event Image */}
        <div className="space-y-2">
          <label className="text-lg font-normal font-kulim text-[#B0B0B0]">Event Image</label>
          {isEditing ? (
            <div
              className="relative border-2 border-dashed border-[#B0B0B0] rounded-lg p-4 text-center cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {currentImage ? (
                <div className="relative w-full h-48">
                  <Image
                    src={currentImage}
                    alt={formData.title}
                    fill
                    className="object-cover rounded-lg opacity-80 group-hover:opacity-60 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                    <span className="ml-2 text-white font-semibold">Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-[#B0B0B0]">
                  <Camera className="mx-auto mb-2 w-8 h-8" />
                  <p className="text-sm">Click to upload image</p>
                  <p className="text-xs">PNG, JPG or JPEG (Max 10MB)</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          ) : (
            currentImage && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src={currentImage}
                  alt={formData.title}
                  fill
                  className="object-cover"
                />
              </div>
            )
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-lg font-normal font-kulim text-[#B0B0B0]">Title</label>
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full h-12 bg-transparent border border-white rounded px-3 text-white focus:ring-2 focus:ring-[#6200EE] outline-none"
            />
          ) : (
            <p className="text-white font-semibold text-lg">{formData.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-lg font-normal font-kulim text-[#B0B0B0]">Description</label>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
              className="w-full bg-transparent border border-white rounded px-3 py-2 text-white focus:ring-2 focus:ring-[#6200EE] outline-none resize-none"
            />
          ) : (
            <p className="text-[#B0B0B0] text-sm leading-relaxed">{formData.description || "—"}</p>
          )}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-lg font-normal font-kulim text-[#B0B0B0]">Date</label>
          {isEditing ? (
            <div className="relative">
              <input
                type="date"
                name="date"
                ref={dateInputRef}
                value={formData.date ? formData.date.split("T")[0] : ""}
                onChange={handleChange}
                className="w-full h-12 bg-transparent border border-white rounded px-3 text-white focus:ring-2 focus:ring-[#6200EE] outline-none"
              />
              <Calendar
                className="absolute right-3 top-3 text-white cursor-pointer w-5 h-5"
                onClick={() => dateInputRef.current?.showPicker()}
              />
            </div>
          ) : (
            <p className="text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#B0B0B0]" />
              {new Date(formData.date).toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric"
              })}
            </p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-lg font-normal font-kulim text-[#B0B0B0]">Location</label>
          {isEditing ? (
            <div className="relative">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full h-12 bg-transparent border border-white rounded px-3 text-white focus:ring-2 focus:ring-[#6200EE] outline-none"
              />
              <MapPin className="absolute right-3 top-3 text-white w-5 h-5" />
            </div>
          ) : (
            <p className="text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#B0B0B0]" />
              {formData.location}
            </p>
          )}
        </div>

        {/* Event Type */}
        <div className="space-y-2">
          <label className="text-lg font-normal font-kulim text-[#B0B0B0]">Event Type</label>
          {isEditing ? (
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              className="w-full h-12 bg-[#1F1F1F] border border-white rounded px-3 text-white focus:ring-2 focus:ring-[#6200EE] outline-none"
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type} className="bg-[#1F1F1F]">{type}</option>
              ))}
            </select>
          ) : (
            <span className="inline-block bg-[#6200EE]/20 text-[#6200EE] px-3 py-1 rounded-full text-sm font-medium">
              {formData.event_type}
            </span>
          )}
        </div>

        {/* Ticket Price & Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-lg font-normal font-kulim text-[#B0B0B0]">Ticket Price ($)</label>
            {isEditing ? (
              <input
                type="number"
                name="ticket_price"
                value={formData.ticket_price}
                onChange={handleChange}
                min={1}
                className="w-full h-12 bg-transparent border border-white rounded px-3 text-white focus:ring-2 focus:ring-[#6200EE] outline-none"
              />
            ) : (
              <p className="text-white font-bold text-xl">${formData.ticket_price}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-lg font-normal font-kulim text-[#B0B0B0]">Total Tickets</label>
            {isEditing ? (
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min={1}
                className="w-full h-12 bg-transparent border border-white rounded px-3 text-white focus:ring-2 focus:ring-[#6200EE] outline-none"
              />
            ) : (
              <p className="text-white font-bold text-xl">{formData.quantity}</p>
            )}
          </div>
        </div>

        {/* Potential Revenue (view mode only) */}
        {!isEditing && (
          <div className="bg-[#1F1F1F] rounded-lg p-4">
            <p className="text-[#B0B0B0] text-sm">Potential Revenue</p>
            <p className="text-cyan-400 font-bold text-2xl">
              ${(formData.ticket_price * formData.quantity).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-gray-800 shrink-0">
        {isEditing ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDiscard}
              className="flex-1 bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white rounded-lg py-3 font-semibold transition-colors"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isUpdating}
              className="flex-1 bg-[#6200EE] hover:bg-[#4B00D1] text-white rounded-lg py-3 font-semibold transition-colors disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 bg-[#CF6679]/20 hover:bg-[#CF6679]/40 text-[#CF6679] border border-[#CF6679] rounded-lg px-4 py-3 font-semibold transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#6200EE] hover:bg-[#4B00D1] text-white rounded-lg py-3 font-semibold transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              Edit Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
