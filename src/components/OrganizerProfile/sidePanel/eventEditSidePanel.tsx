"use client";

import React, { useRef, useState } from "react";
import { Upload, Calendar, X, MapPin } from "lucide-react";
import Image from "next/image";
import { Event } from "@/type/EventType";
import { useUpdateEventMutation } from "@/Redux/features/eventApiSlice";
import Swal from "sweetalert2";

const EVENT_TYPES = [
  "Indoor Musical Concert",
  "Outdoor Musical Concert",
  "Standup Comedy show",
  "Meetup",
  "Musical",
];

interface EventEditSidePanelProps {
  event: Event;
  onClose: () => void;
}

const EventEditSidePanel: React.FC<EventEditSidePanelProps> = ({ event, onClose }) => {
  const [formData, setFormData] = useState<Event>({ ...event });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dateInputRef = useRef<HTMLInputElement>(null);
  const [updateEvent, { isLoading }] = useUpdateEventMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = "Title is required.";
    if (!formData.description) newErrors.description = "Description is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    if (!formData.location) newErrors.location = "Location is required.";
    if (formData.ticket_price <= 0) newErrors.ticket_price = "Ticket price must be greater than 0.";
    if (formData.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0.";
    if (!formData.event_type) newErrors.event_type = "Event type is required.";
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
      });
      onClose();
    } catch {
      Swal.fire({ icon: "error", title: "Update Failed", text: "Something went wrong. Please try again." });
    }
  };

  const currentImage = imagePreview || (event.image && event.image.startsWith("http") ? event.image : null);

  return (
    <div className="w-full max-w-[600px] absolute right-0 min-h-screen bg-[#121212] text-white border-l border-gray-800 p-6 overflow-y-auto">
      <div className="flex flex-col w-full mb-6">
        <h2 className="text-2xl font-bold font-raleway">Edit Event</h2>
        <h4 className="text-lg font-normal font-kulim text-[#B0B0B0]">Update the event details below.</h4>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6 text-[#B0B0B0]">

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-lg font-normal font-kulim">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full h-12 bg-transparent border border-white rounded px-3 text-white focus:ring-2 focus:ring-[#6200EE] outline-none"
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-lg font-normal font-kulim">Description</label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={3}
            className="w-full bg-transparent border border-white rounded px-3 py-2 text-white focus:ring-2 focus:ring-[#6200EE] outline-none resize-none"
          />
          {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-lg font-normal font-kulim">Date</label>
          <input
            type="date"
            name="date"
            ref={dateInputRef}
            value={formData.date ? formData.date.split("T")[0] : ""}
            onChange={handleChange}
            className="w-full h-12 bg-transparent border border-white rounded px-3 text-white focus:ring-2 focus:ring-[#6200EE] outline-none"
          />
          <Calendar
            className="absolute right-3 top-10 cursor-pointer text-white w-5 h-5"
            onClick={() => dateInputRef.current?.showPicker()}
          />
          {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-lg font-normal font-kulim">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full h-12 bg-transparent border border-white rounded px-3 text-white focus:ring-2 focus:ring-[#6200EE] outline-none"
          />
          <MapPin className="absolute right-3 top-10 text-white w-5 h-5" />
          {errors.location && <span className="text-red-500 text-sm">{errors.location}</span>}
        </div>

        {/* Event Type */}
        <div className="flex flex-col gap-1">
          <label className="text-lg font-normal font-kulim">Event Type</label>
          <select
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            className="w-full h-12 bg-[#1F1F1F] border border-white rounded px-3 text-white focus:ring-2 focus:ring-[#6200EE] outline-none"
          >
            <option value="" disabled className="bg-[#1F1F1F]">Select event type</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type} className="bg-[#1F1F1F]">{type}</option>
            ))}
          </select>
          {errors.event_type && <span className="text-red-500 text-sm">{errors.event_type}</span>}
        </div>

        {/* Ticket Price & Quantity */}
        <div className="flex flex-col gap-1">
          <label className="text-lg font-normal font-kulim">Ticket Price × Quantity</label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="number"
                name="ticket_price"
                value={formData.ticket_price}
                onChange={handleChange}
                min={1}
                placeholder="Price"
                className="w-full h-12 bg-transparent border border-white rounded px-3 text-white focus:ring-2 focus:ring-[#6200EE] outline-none"
              />
              {errors.ticket_price && <span className="text-red-500 text-xs">{errors.ticket_price}</span>}
            </div>
            <span className="text-white font-bold text-xl">×</span>
            <div className="w-32">
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min={1}
                placeholder="Qty"
                className="w-full h-12 bg-transparent border border-white rounded px-3 text-white focus:ring-2 focus:ring-[#6200EE] outline-none"
              />
              {errors.quantity && <span className="text-red-500 text-xs">{errors.quantity}</span>}
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-1">
          <label className="text-lg font-normal font-kulim">Event Image</label>
          <div className="border-2 border-dashed border-[#B0B0B0] rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="edit-image-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="edit-image-upload" className="cursor-pointer block">
              <Upload className="mx-auto mb-2 w-6 h-6" />
              <p className="text-sm text-[#B0B0B0]">Drop files here or click to upload</p>
              <p className="text-xs text-[#B0B0B0]">PNG, JPG or JPEG (Max 10MB)</p>
            </label>
          </div>

          {currentImage && (
            <div className="relative mt-2">
              <Image
                src={currentImage}
                alt="Event preview"
                width={400}
                height={200}
                className="w-full h-48 object-cover rounded-lg"
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white rounded-lg py-3 font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-[#6200EE] hover:bg-[#4B00D1] text-white rounded-lg py-3 font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventEditSidePanel;
