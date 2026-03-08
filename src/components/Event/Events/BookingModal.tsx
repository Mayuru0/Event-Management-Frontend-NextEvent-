"use client";

import { useState } from "react";
import {
  X, Minus, Plus, CreditCard, Ticket, MapPin, Calendar,
  AlertCircle, Loader2, Tag, ShieldCheck,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";
import {
  useCreateTicketMutation,
  useCreateCheckoutSessionMutation,
} from "@/Redux/features/ticketApiSlice";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    _id: string;
    title: string;
    ticket_price: number;
    date: string;
    location: string;
    event_type: string;
    quantity: number;
    image: string | null;
    organizerid?: string;
  };
}

const BookingModal = ({ isOpen, onClose, event }: BookingModalProps) => {
  const user = useSelector(selectuser);
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [createTicket] = useCreateTicketMutation();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  if (!isOpen) return null;

  const totalPrice = qty * event.ticket_price;
  const serviceFee = parseFloat((totalPrice * 0.05).toFixed(2));
  const grandTotal = parseFloat((totalPrice + serviceFee).toFixed(2));

  const handleBook = async () => {
    if (!user) {
      onClose();
      router.push("/auth/sign-in");
      return;
    }

    setIsProcessing(true);
    try {
      // Step 1: Create a pending ticket record in our database
      const ticketPayload = {
        userId: user._id,
        organizerId: event.organizerid || "",
        eventId: event._id,
        name: user.name,
        profilePic: user.profilePic || "/default-profile.png",
        event_title: event.title,
        location: event.location,
        event_type: event.event_type,
        date: event.date,
        quantity: qty,
        totalPrice: grandTotal,
        status: "pending" as const,
      };

      const ticketRes = await createTicket(ticketPayload).unwrap();
      const ticketId = ticketRes.data._id;

      // Step 2: Create Stripe checkout session
      const sessionRes = await createCheckoutSession({
        title: event.title,
        ticket_price: grandTotal / qty, // per-ticket price including fee
        quantity: qty,
        userId: user._id,
        ticketId,
      }).unwrap();

      // Step 3: Redirect to Stripe
      if (sessionRes.url) {
        window.location.href = sessionRes.url;
      }
    } catch (error) {
      console.error("Booking failed:", error);
      setIsProcessing(false);
      Swal.fire({
        title: "Booking Failed",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        background: "#1A1A1A",
        color: "#fff",
        confirmButtonColor: "#6200EE",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1A1A1A] w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#6200EE] via-[#00FFC2] to-[#6200EE]" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6200EE]/15 border border-[#6200EE]/25 flex items-center justify-center">
              <Ticket className="w-4 h-4 text-[#6200EE]" />
            </div>
            <h2 className="text-base font-bold text-white">Book Tickets</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Event Summary Card */}
        <div className="px-6 pb-4">
          <div className="p-4 rounded-xl bg-[#242424] border border-white/5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#6200EE]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Tag className="w-4 h-4 text-[#6200EE]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm leading-snug mb-2 truncate">{event.title}</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#6200EE] bg-[#6200EE]/10 border border-[#6200EE]/20 px-2 py-0.5 rounded-full shrink-0">
                {event.event_type}
              </span>
            </div>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#1F1F1F] border border-white/5">
            <div>
              <p className="text-sm font-semibold text-white">Number of Tickets</p>
              <p className="text-xs text-gray-500 mt-0.5">
                ${event.ticket_price.toFixed(2)} per ticket · {event.quantity} available
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={qty <= 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#2A2A2A] border border-white/8 text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-white font-bold text-lg">{qty}</span>
              <button
                onClick={() => setQty(Math.min(event.quantity, qty + 1))}
                disabled={qty >= event.quantity}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#6200EE]/20 border border-[#6200EE]/30 text-[#6200EE] hover:bg-[#6200EE]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="px-6 pb-4">
          <div className="p-4 rounded-xl bg-[#6200EE]/8 border border-[#6200EE]/15 space-y-2.5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Price Breakdown</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{qty} × ${event.ticket_price.toFixed(2)}</span>
              <span className="text-gray-300">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Service fee (5%)</span>
              <span className="text-gray-300">${serviceFee.toFixed(2)}</span>
            </div>
            <div className="h-px bg-white/8 my-1" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-white">Total</span>
              <span className="text-xl font-bold text-[#00FFC2]">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Not logged in warning */}
        {!user && (
          <div className="mx-6 mb-4 flex items-center gap-2.5 p-3 rounded-xl bg-amber-900/20 border border-amber-700/25">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-300">Sign in to complete your booking.</p>
          </div>
        )}

        {/* CTA */}
        <div className="px-6 pb-6 pt-0">
          <button
            onClick={handleBook}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 bg-[#6200EE] hover:bg-[#5300D8] active:scale-[0.98] text-white py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#6200EE]/25"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting to payment...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Proceed to Payment · ${grandTotal.toFixed(2)}
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-600" />
            <p className="text-xs text-gray-600">Secured by Stripe · SSL encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
