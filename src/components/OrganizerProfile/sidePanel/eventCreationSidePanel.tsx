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
  console.log("Role:", role);
  console.log("Organizer ID:", organizerid);
  const [formData, setFormData] = useState<Event>({
    _id: '',
   organizerid: organizerid ,
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
    <div className="w-[600px]  absolute flex flex-col items-center right-0 bg-[#121212] text-white border-l border-gray-800 p-6">
      <div className="flex flex-col w-[476px] mb-6">
        <h2 className="text-2xl font-bold font-raleway">New Event</h2>
        <h4 className="text-lg font-normal font-kulim text-[#B0B0B0]">
          Create and submit new events for admin approval.
        </h4>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-7 text-[#B0B0B0]">
        <div className="flex flex-col gap-[5px]">
          <label className="text-lg font-normal font-kulim">Title</label>
          <input
            type="text"
            name="title"
            className="w-[476px] h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
        </div>

        <div className="flex flex-col gap-[5px]">
          <label className="text-lg font-normal font-kulim">Description</label>
          <textarea
            className="w-[476px] bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0] h-24"
            value={formData.description}
            name="description"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
          {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
        </div>

        <div className="flex flex-col gap-[5px] relative">
          <label className="text-lg font-normal font-kulim">Date</label>
          <input
            type="date"
            name="date"
            className="w-[476px] h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
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

        <div className="flex flex-col gap-[5px] relative">
          <label className="text-lg font-normal font-kulim">Location</label>
          <input
            type="text"
            name="location"
            className="w-[476px] h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
            value={formData.location}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, location: e.target.value }))
            }
            required
          />
          <MapPin className="absolute right-4 top-12 text-white" />
          {errors.location && <span className="text-red-500 text-sm">{errors.location}</span>}
        </div>

        <div className="flex flex-col gap-[5px]">
          <label className="text-lg font-normal font-kulim">
            Regular Ticket Price
          </label>
          <div className="flex items-center space-x-11">
            <input
              type="number"
              name="ticket_price"
              className="w-[250px] h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
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
            <h4 className="text-lg font-normal font-kulim">X</h4>
            <input
              type="number"
              name="quantity"
              className="w-[125px] h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
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

        <div className="flex flex-col gap-2 w-[476px]">
          <label htmlFor="eventType" className="text-lg font-normal font-kulim">
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
            <option className="bg-transparent" value="conference">
              Conference
            </option>
            <option className="bg-transparent" value="workshop">
              Workshop
            </option>
            <option className="bg-transparent" value="webinar">
              Webinar
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

        <div className="w-[476px] flex flex-col gap-[5px]">
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
              <p className="text-lg font-normal text-[#B0B0B0]">
                Drop Files Here or Click to Upload
              </p>
              <p className="text-xs font-lg">
                The image will be used as the event cover picture
              </p>
            </label>
          </div>
          {formData.image && (
            <div className="flex justify-center mt-4 border-2 border-dashed border-[#B0B0B0] rounded-md p-4 text-center">
              <div className="relative w-[111px] h-[110px]">
                <Image
                  src={formData.image}
                  alt="Upload preview"
                  className="w-full h-full object-cover rounded-md opacity-70"
                  width={111}
                  height={110}
                  
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-3 left-11 border-2 border-white rounded-full bg-transparent"
                >
                  <X size={17} className="text-white" />
                </button>
              </div>
            </div>
          )}
          {errors.image && <span className="text-red-500 text-sm ">{errors.image}</span>}
        </div>

        <div className="flex gap-4 mt-8 w-[476px] font-raleway">
          <button
            onClick={onClose}
            type="button"
            className="flex-1 bg-[#CF6679] text-black rounded-md py-2 hover:bg-[#c56072] text-lg font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-[#6200EE] text-white rounded-md py-2 hover:bg-[#4B00D1] text-lg font-bold"
          >
            {isLoading ? "Creating Event..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventCreationSidePanel;