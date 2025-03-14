import { Switch } from "@/components/ui/switch";
import { Calendar, MapPin, PencilIcon } from "lucide-react";
import Image from "next/image"; // ✅ Use Next.js Image
import React, { useRef } from "react";
import { Event } from "@/type/EventType";



interface RightSidebarProps {
  event: Event;
  onClose: () => void;
}


const RightSidebar: React.FC<RightSidebarProps> = ({ event, onClose }) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    dateInputRef.current?.showPicker(); // Opens native date picker
  };

  const [formData, setFormData] = React.useState<Event>(event);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-[600px] absolute top-16 flex flex-col items-center right-0 bg-[#121212] text-white border-l border-gray-800 p-6">
      <div className="w-[476px] flex justify-between mb-4">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold font-raleway">View Event</h2>
          <h4 className="text-[#B0B0B0] font-normal text-lg font-kulim">
            View event details
          </h4>
        </div>
        <button className="flex w-[146px] h-[50px] gap-1 text-lg font-bold text-white bg-[#6200EE] hover:bg-[#431e79] rounded-[5px] justify-center items-center">
          Update <PencilIcon className="w-[22px] h-[22px]" />
        </button>
      </div>

      {/* Archive Switch */}
      <div className="flex w-[476px] items-center gap-7 mb-4">
        <Switch />
        <span className="font-bold text-2xl font-raleway text-white">
          Archive Event
        </span>
      </div>

      <form className="flex flex-col items-center space-y-7 text-[#B0B0B0]">
        <div className="flex flex-col gap-[5px]">
          <label className="text-lg font-normal font-kulim">Title</label>
          <input
            type="text"
            className="w-[476px] h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
            name="title"
            value={formData.title} // ✅ Use formData
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-[5px]">
          <label className="text-lg font-normal font-kulim">Description</label>
          <textarea
            className="w-[476px] bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0] h-24"
            name="description"
            value={formData.description || ""} // ✅ Use formData
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-[5px] relative">
          <label className="text-lg font-normal font-kulim">Date</label>
          <input
            type="text"
            className="w-[476px] h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
            name="date"
            value={formData.date} // ✅ Use formData
            onChange={handleChange}
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
            name="location"
            value={formData.location} // ✅ Use formData
            onChange={handleChange}
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
              name="price"
              value={formData.ticket_price || ""} // ✅ Use formData
              onChange={handleChange}
            />
            <h4 className="text-lg font-normal font-kulim">X</h4>
            <input
              type="number"
              className="w-[125px] h-14 bg-transparent border-[1px] border-white rounded p-2 text-[#B0B0B0]"
              name="quantity"
              value={formData.quantity || ""} // ✅ Use formData
              onChange={handleChange}
            />
          </div>
        </div>

        <hr className="bg-white w-[476px]" />

        <div className="w-[476px] flex flex-wrap justify-center gap-4 border-2 border-dashed border-[#B0B0B0] rounded-md p-4 text-center">
          {formData.image && formData.image.length > 0 && (
            <div className="relative w-[111px] h-[110px]">
              <Image
                src={formData.image} // ✅ Use Next.js Image
                alt={formData.title}
                className="w-full h-full object-cover rounded-md opacity-70"
                width={111}
                height={110}
              />
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8 w-[476px] font-raleway">
          <button
            type="button"
            className="flex-1 bg-[#CF6679] text-black rounded-md py-2 hover:bg-[#c56072] text-lg font-bold"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            type="submit"
            className="flex-1 bg-[#6200EE] text-white rounded-md py-2 hover:bg-[#4B00D1] text-lg font-bold"
          >
            Done
          </button>
        </div>
      </form>
    </div>
  );
};

export default RightSidebar;
