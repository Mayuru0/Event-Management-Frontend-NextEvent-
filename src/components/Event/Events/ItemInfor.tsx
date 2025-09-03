"use client";

import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
//import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
//import { Label } from "@/components/ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { Event } from "../../../type/EventType";
import { createCheckoutSession } from "@/components/Payment/actions";

const ItemInfo: React.FC<Event> = ({
  // _id,
  title,
  ticket_price,
  description,
  date,
  event_type,
  image,
  location,

  //popularity,
  quantity,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quantitySelected, setQuantity] = useState(1);

  const images = [image]; // assuming `image` is passed as a prop

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Link
        href="../events"
        className="inline-flex items-center gap-2 p-4 mt-20 text-sm text-gray-400 hover:text-white"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Event
      </Link>

      <div className="items-center grid lg:grid-cols-2 gap-8 p-4 md:p-8 max-w-7xl mx-auto mt-20">
        <div className="py-4 relative aspect-square rounded-lg overflow-hidden mr-16">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full ${
                  currentSlide === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6 ml-16">
          <h1 className="font-raleway text-5xl font-semibold">{title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-[#03DAC6] text-base"
              />
              <span className="font-bold text-base">{location}</span>
            </div>

            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faCalendarDays}
                className="text-[#03DAC6] text-base"
              />
              <span className="font-bold text-base font-raleway">
                {new Date(date).toLocaleDateString()}
              </span>
            </div>
          </div>

          <p className="text-gray-400 leading-relaxed font-light text-lg font-kulim">
            {description}
          </p>

          <hr />

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-300">Event Type </h3>
            <h3 className="font-bold text-lg text-gray-300">{event_type}</h3>

            {/* <RadioGroup defaultValue="vip" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="vip"
                  id="vip"
                  className="appearance-none w-5 h-5 border border-white rounded-full flex items-center justify-center checked:bg-white"
                >
                  <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                </RadioGroupItem>
                <Label htmlFor="vip" className="text-white font-medium">
                  VIP
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="regular"
                  id="regular"
                  className="appearance-none w-5 h-5 border border-white rounded-full flex items-center justify-center checked:bg-white"
                >
                  <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                </RadioGroupItem>
                <Label htmlFor="regular" className="text-white font-medium">
                  Regular
                </Label>
              </div>
            </RadioGroup> */}
          </div>

          <hr className="border-gray-700 my-4" />

          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <p className="text-2xl font-bold text-white">${ticket_price}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-white">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantitySelected - 1))}
                  className="bg-white text-black font-extrabold px-4 py-2 rounded-none"
                >
                  -
                </Button>
                <span className="w-12 text-center bg-black text-white font-normal text-lg py-0">
                  {quantitySelected.toString().padStart(2, "0")}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantitySelected + 1)}
                  className="bg-white text-black font-extrabold px-4 py-2 rounded-none"
                >
                  +
                </Button>
              </div>
              <p className="text-sm text-gray-400">
                {quantity} Tickets Available
              </p>
            </div>
          </div>
          <form
            action={() =>
              createCheckoutSession({
                title,
                ticket_price,
                description,
                
                
                image: image ?? "/placeholder.svg",
               
                quantity
              })
            }
            className="w-full"
          >
            <Button className="w-full bg-[#6200EE] hover:bg-[#5300E8] text-white py-6 rounded-none">
              Buy Now
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemInfo;
