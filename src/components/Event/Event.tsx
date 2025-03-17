"use client";
import { Averia_Gruesa_Libre } from "next/font/google";
import React from "react";
import PeopleWhatSay from "./people_what_say";
import Image from "next/image";
import { useGetAllEventsQuery } from "@/Redux/features/eventApiSlice";
import Swal from "sweetalert2";
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
      <p className="text-center text-xl md:text-2xl font-semibold text-white mt-10">
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

  const eventsToShow = events.slice(0, 3);

  return (
    <div className="flex flex-col items-center py-8 px-4 md:px-8">
      <div className="text-center space-y-4 mb-6">
        <h2 className="text-white text-3xl md:text-5xl font-bold">
          Explore Upcoming Events
        </h2>
        <p className="text-[#b0b0b0] text-base md:text-lg">
          Discover a variety of exciting events happening soon! Whether
          you&apos;re looking to attend or organize, explore our events by
          category and find the perfect experience for you. Don’t miss out on
          the fun—sign up or buy your tickets today!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {eventsToShow.map((event, index) => (
          <div
            key={index}
            className="bg-[#1f1f1f] rounded-[10px] shadow-lg flex flex-col overflow-hidden"
          >
            <Image
              width={405}
              height={285}
              className="w-full h-[250px] object-cover"
              src={event.image || "/path/to/default/image.jpg"}
              alt={event.title}
            />

            <div className="p-5 flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-white text-xl md:text-2xl font-bold">
                  {event.title}
                </h3>
                <span
                  className={`text-[#03dac6] text-2xl md:text-3xl font-light ${averiaGruesaLibre.className}`}
                >
                  {event.ticket_price}
                </span>
              </div>

              <div className="flex justify-between text-[#b0b0b0] text-sm md:text-lg">
                <span>
                  {new Date(event.date || "Unknown Date").toLocaleDateString()}
                </span>
                <span>{event.location}</span>
              </div>

              <p className="text-[#888888] text-sm md:text-base line-clamp-2">
                {event.description}
              </p>

              <button
                onClick={() => handleBuyTicket(event._id)}
                className="w-full bg-[#6200EE] hover:bg-purple-700 text-white py-2 px-4 rounded-full transition duration-200"
              >
                Buy Tickets
              </button>
            </div>
          </div>
        ))}
      </div>
{/* 
      <PeopleWhatSay /> */}
    </div>
  );
};

export default Event;
