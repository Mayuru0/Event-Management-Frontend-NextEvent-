/* eslint-disable */
"use client";

import Image from "next/image";
import React from "react";
import hero1 from "./../../../../public/landing.png";
import { useRouter } from "next/navigation";
import { MdKeyboardArrowLeft } from "react-icons/md";

const EHero1 = () => {
  const router = useRouter();

  return (
    <div className="relative w-full">
      {/* Back Button */}
      <div className="absolute inset-0  mt-[15%] md:mt-[5%] px-6 md:px-24">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-white text-sm md:text-lg font-medium space-x-2 hover:opacity-80 transition"
        >
          <MdKeyboardArrowLeft size={20} />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Hero Text */}
      <div className="absolute inset-0 flex flex-col items-center mt-[20%] md:mt-[10%] px-6">
        <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold text-center">
          Events
        </h1>
        <h2 className="text-gray-400 text-sm md:text-lg text-center px-4 max-w-2xl mt-4">
          Discover a variety of exciting events happening soon! Whether you're looking 
          to attend or organize, explore our events by category and find the perfect 
          experience for you. Don’t miss out on the fun—sign up or buy your tickets today!
        </h2>
      </div>

      {/* Background Image */}
      <Image
        src={hero1}
        alt="Events Hero"
        layout="responsive"
        width={1920}
        height={1080}
        className="w-full h-auto"
      />
    </div>
  );
};

export default EHero1;
