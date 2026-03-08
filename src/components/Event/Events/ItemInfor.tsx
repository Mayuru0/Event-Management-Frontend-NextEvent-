"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, MapPin, Calendar, Tag, Users, Minus, Plus, Clock } from "lucide-react";
import { Event } from "../../../type/EventType";
import BookingModal from "./BookingModal";

const ItemInfo: React.FC<Event> = ({
  _id,
  title,
  ticket_price,
  description,
  date,
  event_type,
  image,
  location,
  organizerid,
  popularity,
  quantity,
  status,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewQty, setPreviewQty] = useState(1);

  const isSoldOut = quantity === 0;
  const isUpcoming = new Date(date) > new Date();

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      {/* Back button */}
      <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Events
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left — Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#1A1A1A]">
              <Image
                src={image || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover"
                priority
              />
              {/* Status badge */}
              <div className="absolute top-4 left-4">
                {isSoldOut ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/90 text-white backdrop-blur-sm">
                    Sold Out
                  </span>
                ) : isUpcoming ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00FFC2]/90 text-black backdrop-blur-sm">
                    Available
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/90 text-white backdrop-blur-sm">
                    Ended
                  </span>
                )}
              </div>
            </div>

            {/* Quick stats below image */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#1A1A1A] border border-white/5 text-center">
                <p className="text-xs text-gray-500 mb-1">Type</p>
                <p className="text-sm font-semibold text-white truncate">{event_type}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#1A1A1A] border border-white/5 text-center">
                <p className="text-xs text-gray-500 mb-1">Available</p>
                <p className="text-sm font-semibold text-white">{quantity}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#1A1A1A] border border-white/5 text-center">
                <p className="text-xs text-gray-500 mb-1">Popularity</p>
                <p className="text-sm font-semibold text-white">{popularity ?? "—"}</p>
              </div>
            </div>
          </div>

          {/* Right — Details */}
          <div className="space-y-6">
            {/* Type badge + title */}
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6200EE] bg-[#6200EE]/10 border border-[#6200EE]/20 px-2.5 py-1 rounded-full mb-3">
                <Tag className="w-3 h-3" />
                {event_type}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">{title}</h1>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-7 h-7 rounded-lg bg-[#1A1A1A] border border-white/8 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-[#03DAC6]" />
                </div>
                {location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-7 h-7 rounded-lg bg-[#1A1A1A] border border-white/8 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-[#03DAC6]" />
                </div>
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {isUpcoming && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-7 h-7 rounded-lg bg-[#1A1A1A] border border-white/8 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-[#03DAC6]" />
                  </div>
                  {new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">About This Event</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
            </div>

            <div className="h-px bg-white/5" />

            {/* Quantity selector */}
            <div>
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Select Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 p-1 rounded-xl bg-[#1A1A1A] border border-white/8">
                  <button
                    onClick={() => setPreviewQty(Math.max(1, previewQty - 1))}
                    disabled={previewQty <= 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#242424] text-white hover:bg-[#2e2e2e] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-lg text-white">{previewQty}</span>
                  <button
                    onClick={() => setPreviewQty(Math.min(quantity, previewQty + 1))}
                    disabled={previewQty >= quantity || isSoldOut}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#6200EE]/20 border border-[#6200EE]/30 text-[#6200EE] hover:bg-[#6200EE]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  {quantity} tickets left
                </div>
              </div>
            </div>

            {/* Price + CTA */}
            <div className="p-5 rounded-2xl bg-[#1A1A1A] border border-white/8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Price per ticket</p>
                  <p className="text-3xl font-bold text-white">${ticket_price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-0.5">Subtotal ({previewQty})</p>
                  <p className="text-xl font-bold text-[#00FFC2]">
                    ${(ticket_price * previewQty).toFixed(2)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isSoldOut || !isUpcoming}
                className="w-full py-4 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed
                  bg-[#6200EE] hover:bg-[#5300D8] active:scale-[0.98] text-white shadow-lg shadow-[#6200EE]/20"
              >
                {isSoldOut
                  ? "Sold Out"
                  : !isUpcoming
                  ? "Event Ended"
                  : "Book Now"}
              </button>
              {!isSoldOut && isUpcoming && (
                <p className="text-center text-xs text-gray-600 mt-2.5">
                  Secure checkout · Instant confirmation
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={{
          _id,
          title,
          ticket_price,
          date,
          location,
          event_type,
          quantity,
          image,
          organizerid,
        }}
      />
    </div>
  );
};

export default ItemInfo;
