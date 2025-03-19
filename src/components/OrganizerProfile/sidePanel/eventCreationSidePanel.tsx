"use client";

import React, { useRef, useState } from "react";
import { Upload, Calendar, X, MapPin } from "lucide-react";
import Image from "next/image";
import { Event } from "@/type/EventType";
import { useCreateEventMutation } from "@/Redux/features/eventApiSlice";
import Swal from 'sweetalert2';
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";

interface NewEventSideBarProps {
  onClose: () => void;
}

const EventCreationSidePanel: React.FC<NewEventSideBarProps> = ({ onClose }) => {
  const user = useSelector(selectuser);
  const role = user?.role;
  const organizerid = (role === "organizer" || role === "admin") ? user?._id ?? '' : '';
  const [formData, setFormData] = useState<Event>({
    _id: '',
    organizerid: organizerid,
    title: '',
    ticket_price: 0,
    description: '',
    date: '',
    event_type: '',
    image: '',
    location: '',
    popularity: 10,
    quantity: 0,
    status: 'Pending',
    createdAt: '',
    updatedAt: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    dateInputRef.current?.showPicker();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageURL = URL.createObjectURL(file);
      setImageFile(file);
      setFormData((prev) => ({
        ...prev,
        image: imageURL,
      }));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setFormData((prev) => ({
      ...prev,
      image: '',
    }));
  };

  const [Crate_Event, { isLoading }] = useCreateEventMutation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title) newErrors.title = "Title is required.";
    if (!formData.description) newErrors.description = "Description is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    if (!formData.location) newErrors.location = "Location is required.";
    if (formData.ticket_price <= 0)
      newErrors.ticket_price = "Ticket price must be greater than 0.";
    if (formData.quantity <= 0)
      newErrors.quantity = "Quantity must be greater than 0.";
    if (!formData.event_type) newErrors.event_type = "Event type is required.";

    // Check if either formData.image or imageFile is present
    if (!formData.image && !imageFile) {
      newErrors.image = "Image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill out all required fields correctly.',
      });
      return;
    }

    const form = new FormData();

    // Ensure organizerid is defined
    if (formData.organizerid) form.append("organizerid", formData.organizerid);

    // Ensure other fields are defined before appending
    if (formData.title) form.append("title", formData.title);
    if (formData.ticket_price) form.append("ticket_price", formData.ticket_price.toString());
    if (formData.description) form.append("description", formData.description);
    if (formData.date) form.append("date", formData.date);
    if (formData.event_type) form.append("event_type", formData.event_type);
    if (formData.location) form.append("location", formData.location);
    if (formData.popularity) form.append("popularity", formData.popularity.toString());
    if (formData.quantity) form.append("quantity", formData.quantity.toString());
    if (formData.status) form.append("status", formData.status);

    // Check if an image file exists before appending
    if (imageFile) form.append("image", imageFile);

    try {
      const response = await Crate_Event(form).unwrap();

      if (response) {
        Swal.fire({
          icon: 'success',
          title: 'Event Created',
          text: 'Your event has been successfully created and submitted for approval!',
        });
        onClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an issue creating the event. Please try again.',
        });
      }
    } catch (error) {
      console.error("Error occurred:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again later.',
      });
    }
  };

  return (
    <div className="w-full max-w-[600px] absolute min-h-screen flex flex-col items-center right-0 bg-[#121212] text-white border-l border-gray-800 p-6 sm:p-4">
      <div className="flex flex-col w-full mb-6">
        <h2 className="text-2xl font-bold font-raleway sm:text-xl">New Event</h2>
        <h4 className="text-lg font-normal font-kulim text-[#B0B0B0] sm:text-sm">
          Create and submit new events for admin approval.
        </h4>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-7 text-[#B0B0B0] w-full">
        <div className="flex flex-col gap-[5px] w-full">
          <label className="text-lg font-normal font-kulim sm:text-base">Title</label>
          <input
            type="text"
            name="title"
            className="w-full h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
        </div>

        <div className="flex flex-col gap-[5px] w-full">
          <label className="text-lg font-normal font-kulim sm:text-base">Description</label>
          <textarea
            className="w-full bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0] h-24"
            value={formData.description}
            name="description"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
          {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
        </div>

        <div className="flex flex-col gap-[5px] relative w-full">
          <label className="text-lg font-normal font-kulim sm:text-base">Date</label>
          <input
            type="date"
            name="date"
            className="w-full h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
            value={formData.date}
            ref={dateInputRef}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            required
          />
          <Calendar
            className="absolute right-4 top-12 cursor-pointer text-white"
            onClick={handleIconClick}
          />
          {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
        </div>

        <div className="flex flex-col gap-[5px] relative w-full">
          <label className="text-lg font-normal font-kulim sm:text-base">Location</label>
          <input
            type="text"
            name="location"
            className="w-full h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
            value={formData.location}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, location: e.target.value }))
            }
            required
          />
          <MapPin className="absolute right-4 top-12 text-white" />
          {errors.location && <span className="text-red-500 text-sm">{errors.location}</span>}
        </div>

        <div className="flex flex-col gap-[5px] w-full">
          <label className="text-lg font-normal font-kulim sm:text-base">
            Regular Ticket Price
          </label>
          <div className="flex items-center space-x-11">
            <input
              type="number"
              name="ticket_price"
              className="w-full sm:w-[250px] h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
              value={formData.ticket_price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ticket_price: Number(e.target.value),
                }))
              }
              min="1"
              required
            />
            <h4 className="text-lg font-normal font-kulim sm:text-base">X</h4>
            <input
              type="number"
              name="quantity"
              className="w-full sm:w-[125px] h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
              value={formData.quantity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quantity: Number(e.target.value),
                }))
              }
              min="1"
              required
            />
          </div>
          {errors.ticket_price && <span className="text-red-500 text-sm">{errors.ticket_price}</span>}
          {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity}</span>}
        </div>

        <div className="flex flex-col gap-2 w-full sm:w-[476px]">
          <label htmlFor="eventType" className="text-lg font-normal font-kulim sm:text-base">
            Event Types
          </label>
          <select
            id="eventType"
            name="event_type"
            className="border bg-transparent border-gray-300 rounded-lg p-2"
            value={formData.event_type}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, event_type: e.target.value }))
            }
            required
          >
            <option className="bg-transparent" value="">
              Select an event type
            </option>
            <option className="bg-transparent" value="Indoor Musical Concert">
              Indoor Musical Concert
            </option>
            <option className="bg-transparent" value="Outdoor Musical Concert">
              Outdoor Musical Concert
            </option>
            <option className="bg-transparent" value="Standup Comedy show">
              Standup Comedy show
            </option>
            <option className="bg-transparent" value="meetup">
              Meetup
            </option>
            <option className="bg-transparent" value="musical">
              Musical
            </option>
          </select>
          {errors.event_type && <span className="text-red-500 text-sm">{errors.event_type}</span>}
        </div>

        <div className="w-full sm:w-[476px] flex flex-col gap-[5px]">
          <div className="border-2 border-dashed border-[#B0B0B0] rounded-md p-4 text-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={handleImageUpload}
              required
            />
            <label htmlFor="image-upload" className="cursor-pointer px-16">
              <Upload className="mx-auto mb-2" />
              <p className="text-lg font-normal text-[#B0B0B0] sm:text-base">
                Drop Files Here or Click to Upload
              </p>
              <p className="text-xs text-[#B0B0B0]">PNG, JPG or JPEG (Max size: 10MB)</p>
            </label>
            {imageFile && (
              <div className="relative mt-4">
                <Image
                  src={URL.createObjectURL(imageFile)}
                  alt="event image"
                  width={200}
                  height={200}
                  className="object-cover w-auto h-auto rounded-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            {errors.image && <span className="text-red-500 text-sm">{errors.image}</span>}
          </div>
        </div>

        <div className="flex w-full gap-4 mt-6 sm:flex-col sm:gap-2">
          <button
            type="submit"
            className="w-32 sm:w-full bg-green-500 text-white rounded p-3 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            className="w-32 sm:w-full bg-gray-500 text-white rounded p-3 flex items-center justify-center"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventCreationSidePanel;
