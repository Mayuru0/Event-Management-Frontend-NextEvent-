"use client";
import { Averia_Gruesa_Libre } from "next/font/google";
import React from "react";
import PeopleWhatSay from "./people_what_say";
import Image from "next/image";
import { useGetAllEventsQuery } from "@/Redux/features/eventApiSlice";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useSelector } from "react-redux";
import { selectuser } from "@/Redux/features/authSlice";
import { useRouter } from "next/navigation";
const averiaGruesaLibre = Averia_Gruesa_Libre({
  subsets: ["latin"],
  weight: ["400"],
});

const Event = () => {
  const { data: events = [], isLoading, isError } = useGetAllEventsQuery();
  const user = useSelector(selectuser);
  const router = useRouter();

  if (isLoading) {
    return (
      <p className="text-center text-xl font-semibold text-white relative -mt-[20%] ">
        Loading events...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 text-lg font-semibold">
        Failed to load events.
      </p>
    );
  }

  const handleBuyTicket = (eventId: string) => {
    if (user) {
      router.push(`/events/${eventId}`);
    } else {
      Swal.fire({
        title: "You are not logged in!",
        text: "Please log in to purchase tickets.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/auth/signin");
        }
      });
    }
  };

  // Show only the first 3 events
  const eventsToShow = events.slice(0, 3);

  return (
    <div className="flex flex-wrap justify-center py-8">
      <div className="h-[165px] flex-col justify-center items-center gap-8 flex">
        <div className="self-stretch text-center text-white text-5xl font-bold leading-[57.60px] font-raleway">
          Explore Upcoming Events
        </div>
        <div className=" text-center text-[#b0b0b0] text-lg font-normal font-kulim">
          Discover a variety of exciting events happening soon! Whether
          you&apos;re looking to attend or organize, explore our events by
          category and find the perfect experience for you. Don’t miss out on
          the fun—sign up or buy your tickets today!
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-8 py-px mt-8 font-kulim">
        {eventsToShow.map((event, index) => (
          <div
            key={index}
            className="w-[405px] h-[530px] bg-[#1f1f1f] rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col justify-start items-start inline-flex overflow-hidden"
          >
            <Image
              width={405}
              height={530}
              className="w-[405px] h-[285px]"
              src={event.image || "/path/to/default/image.jpg"} // Provide a fallback image if event.image is null or undefined
              alt={event.title}
            />

            <div className="self-stretch grow shrink basis-0 px-[30px] py-[25px] flex-col justify-between items-center flex">
              <div className="self-stretch justify-between items-center inline-flex">
                <div className="text-center text-white text-2xl font-bold font-raleway leading-[28.80px]">
                  {event.title}
                </div>
                <div
                  className={`text-center text-[#03dac6] text-[34px] font-light font-serif leading-[40.80px] ${averiaGruesaLibre.className}`}
                >
                  {event.ticket_price}
                </div>
              </div>
              <div className="self-stretch justify-between items-center inline-flex">
                <div className="text-center text-[#b0b0b0] text-lg font-normal font-kulim leading-[25.20px]">
                  {new Date(event.date || "Unknown Date").toLocaleDateString()}
                </div>
                <div className="text-center text-[#b0b0b0] text-lg font-normal font-kulim leading-[25.20px]">
                  {event.location}
                </div>
              </div>
              <div className="self-stretch h-11 text-center text-[#888888] text-base font-normal leading-snug">
                {event.description}
              </div>
              <button
                onClick={() => handleBuyTicket(event._id)}
                className="w-full bg-[#6200EE] hover:bg-purple-700 text-white py-2 px-4 rounded-full transition-colors duration-200"
              >
                Buy Tickets
              </button>
            </div>
          </div>
        ))}
      </div>
      <PeopleWhatSay />
    </div>
  );
};

export default Event;
