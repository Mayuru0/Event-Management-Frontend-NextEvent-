"use client";

import Image from "next/image";
import React, { useRef } from "react";
import david from "./../../../public/images/david.jpeg";
import emily from "./../../../public/images/emily.webp";
import mike from "./../../../public/images/mike.jpeg";
import priya from "./../../../public/images/priya.webp";
import alex from "./../../../public/images/alex.jpg";
import kevin from "./../../../public/images/kevin.jpeg";

const testimonials = [
  {
    name: "Mike Peterson",
    role: "Event Attendee",
    feedback:
      "I’ve attended several events through this platform, and the experience has always been top-notch. It’s easy to find events I love, and the process is super smooth.",
    image: david,
  },
  {
    name: "Priya Singh",
    role: "Event Organizer",
    feedback:
      "As an organizer, I value the reliability and innovation this team brings to the table. They’ve helped me grow my audience and host better events every time!",
    image: emily,
  },
  {
    name: "Emily Brown",
    role: "Event Attendee",
    feedback:
      "This platform has introduced me to some of the best events I’ve ever attended. It’s user-friendly, and I love how everything is so well-organized!",
    image: mike,
  },
  {
    name: "David Kim",
    role: "Event Organizer",
    feedback:
      "Their attention to detail and customer support are unmatched. Every event I’ve hosted has been a success thanks to their amazing platform!",
    image: priya,
  },
  {
    name: "Kevin",
    role: "Event Organizer",
    feedback:
      "As an organizer, I value the reliability and innovation this team brings to the table. They’ve helped me grow my audience and host better events every time!",
    image: alex,
  },
  {
    name: "alex",
    role: "Event Attendee",
    feedback:
      "This platform has introduced me to some of the best events I’ve ever attended. It’s user-friendly, and I love how everything is so well-organized!",
    image: kevin,
  },
];

const PeopleWhatSay = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (container) {
      const containerWidth = container.offsetWidth;
      const scrollWidth = container.scrollWidth;
      const mouseX = event.clientX; // Mouse position relative to viewport width
      const viewportWidth = window.innerWidth;

      // Define threshold for how close the mouse needs to be to the edges to trigger scrolling
      const edgeThreshold = 100; // pixels from left or right edge

      // Calculate scroll percentage based on mouse position
      if (scrollWidth > containerWidth) {
        // If mouse is within the threshold of the left or right edge, allow scrolling
        if (mouseX < edgeThreshold) {
          // Mouse is near the left edge
          const scrollPercentage = mouseX / viewportWidth;
          const scrollPos = (scrollWidth - containerWidth) * scrollPercentage;
          container.scrollLeft = Math.max(0, scrollPos); // Prevent scrolling before the first card
        } else if (mouseX > viewportWidth - edgeThreshold) {
          // Mouse is near the right edge
          const scrollPercentage = mouseX / viewportWidth;
          const scrollPos = (scrollWidth - containerWidth) * scrollPercentage;
          container.scrollLeft = Math.min(scrollWidth - containerWidth, scrollPos); // Prevent scrolling past the last card
        }
      }
    }
  };

  return (
    <section className="bg-[#121212] text-white pt-12" onMouseMove={handleMouseMove}>
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">What People Say</h2>
        <p className="text-center text-gray-400 mb-12">
          Hear from our amazing community of event organizers and attendees! Their feedback
          reflects the passion and dedication we bring to <br />
          every event. Discover how we’ve helped create unforgettable experiences, and let
          their words inspire you to join us in making more <br />
          incredible memories.
        </p>
        <div
          ref={scrollContainerRef}
          className="flex overflow-hidden gap-8 pb-6"
          style={{ scrollBehavior: "smooth" }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-neutral-800 p-6 rounded-2xl shadow-lg flex-shrink-0 w-72">
              <div className="text-blue-300 text-4xl font-bold text-center mb-1">“</div>
              <p className="text-base text-center font-normal leading-[22.4px] text-gray-300 mb-4">
                {testimonial.feedback}
              </p>
              <p className="text-sm text-center text-gray-500">{testimonial.role}</p>
              <p className="font-bold text-center">{testimonial.name}</p>
              <Image
              width={100}
              height={100}
                className="w-24 h-24 rounded-full mx-auto mt-4"
                src={testimonial.image}
                alt={testimonial.name}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PeopleWhatSay;
