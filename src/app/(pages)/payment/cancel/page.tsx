"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { XCircle, RotateCcw, ArrowLeft, AlertCircle } from "lucide-react";

const Cancel = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      <div
        className={`relative w-full max-w-md transition-all duration-700 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/8 overflow-hidden shadow-2xl">
          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-red-600 via-red-400 to-red-600" />

          <div className="p-8 text-center">
            {/* Icon */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-red-500/12 border border-red-500/20 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-400" />
              </div>
            </div>

            {/* Text */}
            <h1 className="text-2xl font-bold text-white mb-2">Payment Cancelled</h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Your payment was cancelled and no charges were made. Your ticket reservation has been cancelled.
            </p>

            {/* Divider */}
            <div className="h-px bg-white/5 mb-6" />

            {/* Info box */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-900/15 border border-amber-700/20 mb-6 text-left">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-400">No charges made</p>
                <p className="text-xs text-gray-500">
                  You were not charged. Try again anytime.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#6200EE] hover:bg-[#5300D8] text-white text-sm font-semibold transition-all shadow-lg shadow-[#6200EE]/20"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => router.push("/events")}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all border border-white/8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Events
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

export default Cancel;
