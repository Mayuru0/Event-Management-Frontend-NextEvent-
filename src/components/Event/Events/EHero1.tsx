"use client";

import Image from "next/image";
import React from "react";
import hero1 from "./../../../../public/landing.png";

import { useRouter } from "next/navigation";
import { MdKeyboardArrowLeft } from "react-icons/md";


const EHero1 = () => {
  const router = useRouter();

  return (
    <div className="relative  ">
      <div className="absolute inset-0 mt-[5%] px-24 ">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-white text-lg font-medium space-x-2 hover:opacity-80 transition"
        >
          <MdKeyboardArrowLeft size={20} />
          <span>Back to Home</span>
        </button>
      </div>
      <div className="absolute inset-0 flex mt-[10%] justify-center">
        <h1 className="text-white text-xl md:text-4xl lg:text-5xl xl:text-5xl font-bold font-raleway">
          Events
        </h1>
        <h2 className="absolute text-center text-gray-400 text-xs md:text-sm lg:text-base xl:text-lg px-4 mx-auto max-w-6xl mt-[4%]">
        Discover a variety of exciting events happening soon! Whether you&apos;re looking to attend or organize, explore our events by category and find the perfect experience for you. Don&apos;t miss out on the fun—sign up or buy your tickets today!

      </h2>
        
      </div>
      {/* <div className="absolute mt-[40%] w-full flex justify-center">
  <EventCard />
</div> */}

      <Image
        src={hero1}
        alt="hero1"
        objectFit="cover"
        width={1920}
        height={1080}
      />
    </div>
  );
};

export default EHero1;
