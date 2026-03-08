"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, Ticket, ArrowRight, Home, Sparkles } from "lucide-react";
import Link from "next/link";

const Success = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Slight delay to allow mount animation
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#00FFC2]/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-[#6200EE]/5 blur-3xl" />
      </div>

      <div
        className={`relative w-full max-w-md transition-all duration-700 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/8 overflow-hidden shadow-2xl">
          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-[#6200EE] via-[#00FFC2] to-[#6200EE]" />

          <div className="p-8 text-center">
            {/* Icon */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute w-24 h-24 rounded-full bg-[#00FFC2]/10 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-[#00FFC2]/15 border border-[#00FFC2]/25 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-[#00FFC2]" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-5 h-5 text-[#00FFC2]/60" />
              </div>
            </div>

            {/* Text */}
            <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-1">
              Your booking is confirmed. A confirmation will be sent to your email.
            </p>
            <p className="text-xs text-gray-600 mb-8">
              It may take a moment for your ticket status to update.
            </p>

            {/* Divider */}
            <div className="h-px bg-white/5 mb-6" />

            {/* Status info */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#00FFC2]/8 border border-[#00FFC2]/15 mb-6 text-left">
              <Ticket className="w-4 h-4 text-[#00FFC2] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#00FFC2]">Ticket Confirmed</p>
                <p className="text-xs text-gray-500">View and manage your tickets in your profile.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/profile/customer/my-tickets"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#6200EE] hover:bg-[#5300D8] text-white text-sm font-semibold transition-all shadow-lg shadow-[#6200EE]/20"
              >
                <Ticket className="w-4 h-4" />
                View My Tickets
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => router.push("/events")}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all border border-white/8"
              >
                <Home className="w-4 h-4" />
                Browse More Events
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-700 mt-4">
          Powered by Stripe · Secure Payment
        </p>
      </div>
    </div>
  );
};

export default Success;
