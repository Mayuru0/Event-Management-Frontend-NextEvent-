
"use client"; 

import {  useRouter } from "next/navigation";

const Success = () => {
  const router = useRouter(); 
  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-semibold mb-4">Payment Successful!</h1>
        <p className="text-lg mb-6">
          Thank you for your purchase. Your ticket is confirmed.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-[#6200EE] hover:bg-[#5300E8] text-white py-3 px-6 rounded"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Success;
