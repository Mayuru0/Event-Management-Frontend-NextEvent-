"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { useVerifyPaymentMutation } from "@/Redux/features/paymentApiSlice";
import { PaymentType } from "@/type/PaymentType";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [verifyPayment] = useVerifyPaymentMutation();
  const [payment, setPayment] = useState<PaymentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    verifyPayment(sessionId)
      .unwrap()
      .then((data) => {
        setPayment(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (loading) {
    return (
      <div className="w-full max-w-lg rounded-xl bg-white p-8 text-center shadow-2xl">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-purple-600" />
        <p className="mt-4 text-gray-500">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Payment Successful!</h1>
        <p className="mt-1 text-gray-500">Your ticket has been confirmed.</p>
      </div>

      {/* Payment Details */}
      {payment && (
        <div className="mt-6 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
          <h2 className="mb-2 text-base font-semibold text-gray-700">Payment Summary</h2>

          {[
            { label: "Event",          value: payment.eventTitle },
            { label: "Customer",       value: payment.customerName },
            { label: "Amount Paid",    value: `${payment.currency?.toUpperCase()} ${payment.amount?.toFixed(2)}` },
            { label: "Payment Method", value: payment.paymentMethod || "Card" },
            { label: "Date",           value: payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium capitalize text-gray-800">{value || "—"}</span>
            </div>
          ))}

          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
              ✓ {payment.paymentStatus}
            </span>
          </div>

          <div className="border-t pt-2">
            <p className="break-all text-xs text-gray-400">Ref: {payment.stripeSessionId}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center text-sm text-yellow-700">
          Payment was received but details could not be loaded. Please contact support if needed.
        </div>
      )}

      <p className="mt-4 text-center text-xs text-gray-400">
        A confirmation will be sent to you shortly.
      </p>

      <Link
        href="/"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700"
      >
        Back to Home <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 sm:p-8">
      <Suspense
        fallback={
          <div className="w-full max-w-lg rounded-xl bg-white p-8 text-center shadow-2xl">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-purple-600" />
            <p className="mt-4 text-gray-500">Loading...</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
