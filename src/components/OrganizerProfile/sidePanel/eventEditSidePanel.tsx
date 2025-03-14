"use client";

import React, { useRef, useState } from "react";
import { Upload, Calendar, X, MapPin, PencilLine } from "lucide-react";
import Image from "next/image"; // Import Image from next/image

interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  quantity: number;
  images: File[];
}

const EventEditSidePanel = ({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) => {
  const [formData, setFormData] = React.useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    location: "",
    price: 0,
    quantity: 0,
    images: [],
  });

  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    dateInputRef.current?.showPicker(); // Opens native date picker
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...filesArray],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const [products] = useState([
    { title: "VIP", price: "$99", qty: "x50" },
    { title: "Premium", price: "$149", qty: "x30" },
    { title: "Basic", price: "$49", qty: "x100" },
  ]);

  return (
    <div className="w-[600px] absolute flex flex-col items-center right-0 bg-[#121212] text-white border-l border-gray-800 p-6">
      <div className="flex flex-col w-[476px] mb-6">
        <h2 className="text-2xl font-bold font-raleway">Edit Event</h2>
        <h4 className="text-lg font-normal font-kulim text-[#B0B0B0]">
          Edit event details
        </h4>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-7 text-[#B0B0B0]"
      >
        <div className="flex flex-col gap-[5px]">
          <label className="text-lg font-normal font-kulim">Title</label>
          <input
            type="text"
            className="w-[476px] h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-[5px]">
          <label className="text-lg font-normal font-kulim">Description</label>
          <textarea
            className="w-[476px] bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0] h-24"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-[5px] relative">
          <label className="text-lg font-normal font-kulim">Date</label>
          <input
            type="date"
            className="w-[476px] h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
            value={formData.date}
            ref={dateInputRef}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
          />
          <Calendar
            className="absolute right-4 top-12 cursor-pointer text-white"
            onClick={handleIconClick}
          />
        </div>

        <div className="flex flex-col gap-[5px] relative">
          <label className="text-lg font-normal font-kulim">Location</label>
          <input
            type="text"
            className="w-[476px] h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
            value={formData.location}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, location: e.target.value }))
            }
          />
          <MapPin className="absolute right-4 top-12 text-white" />
        </div>

        <div className="flex flex-col gap-[5px]">
          <label className="text-lg font-normal font-kulim">
            Regular Ticket Price
          </label>
          <div className="flex items-center space-x-11">
            <input
              type="number"
              className="w-[250px] h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
            />
            <h4 className="text-lg font-normal font-kulim">X</h4>
            <input
              type="number"
              className="w-[125px] h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
              value={formData.quantity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quantity: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>

        <div className="flex gap-4 w-[476px]">
          <input
            type="checkbox"
            id="checkbox"
            className="w-6 h-6 rounded border-none accent-[#03DAC6]"
          />
          <label htmlFor="checkbox" className="text-lg font-normal font-kulim">
            This Event has Ticket Types
          </label>
        </div>

        <hr className="bg-white w-[476px]" />

        <div className="w-[476px] font-kulim font-normal text-sm">
          {/* table */}
          <table className="table table-bordered border-[1px] rounded-md w-[326px] h-[140px] text-left">
            <thead>
              <tr>
                <th className="pl-4">Title</th>
                <th className="pl-4">Price</th>
                <th className="pl-4">Qty</th>
                <th className="pl-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-[1px]">
                  <td className="pl-4">{product.title}</td>
                  <td className="pl-4">{product.price}</td>
                  <td className="pl-4">{product.qty}</td>
                  <td className="pl-6">
                    <PencilLine className="bg-white w-6 h-6 p-1 rounded-[3px] text-black" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* end table */}
        </div>

        <hr className="bg-white w-[476px]" />

        <div className="w-[476px] flex gap-[10px] items-center">
          <button className="bg-[#03DAC6] px-2 rounded text-white text-2xl font-kulim font-normal">
            +
          </button>
          <span className="text-lg font-kulim font-normal text-white">
            Add Another Type
          </span>
        </div>

        <div className="w-[476px] flex flex-col gap-[5px]">
          <div className="border-2 border-dashed border-[#B0B0B0] rounded-md p-4 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload" className="cursor-pointer px-16">
              <Upload className="mx-auto mb-2" />
              <p className="text-lg font-normal text-[#B0B0B0]">
                Drop Files Here or Click to Upload
              </p>
              <p className="text-xs font-lg">
                The first image will be used as the event cover picture
              </p>
            </label>
          </div>
          {formData.images.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-4 border-2 border-dashed border-[#B0B0B0] rounded-md p-4 text-center">
              {formData.images.map((image, index) => (
                <div key={index} className="relative w-[111px] h-[110px]">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`Upload preview ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md opacity-70"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-3 left-11 border-2  border-white rounded-full bg-transparent"
                  >
                    <X size={17} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8 w-[476px]">
          <button
            onClick={toggleSidebar}
            type="button"
            className="flex-1 bg-[#CF6679] text-black rounded-md font-bold py-2 hover:bg-[#c56072]"
          >
            Discard Changes
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#6200EE] text-white rounded-md font-bold py-2 hover:bg-[#4B00D1]"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventEditSidePanel;
