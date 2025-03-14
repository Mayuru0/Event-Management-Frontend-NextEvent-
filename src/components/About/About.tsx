import React from "react";
import Image from "next/image";
import { Kulim_Park, Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const kulimPark = Kulim_Park({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
});

const About = () => {
  return (
    <div
      className=" text-white py-16 px-6 md:px-12 lg:px-20"
      style={{ backgroundColor: "#121212" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Text Section */}
          <div className="text-center lg:text-right lg:max-w-2xl">
            <p className="text-sm uppercase tracking-wider mb-4 text-white">
              About Us
            </p>
            <h1
              className={`text-4xl md:text-5xl font-normal mb-6 ${raleway.className}`}
            >
              Who We Are
            </h1>
            <p
              className={`text-gray-300 text-base md:text-lg leading-relaxed mb-6 ${kulimPark.className}`}
            >
              At the heart of our platform is a passion for bringing people
              together through extraordinary events. We specialize in connecting
              event organizers and attendees, ensuring seamless experiences from
              start to finish. With innovative collaboration and a commitment to
              excellence, we create opportunities to celebrate, learn, and
              inspire.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full">
              Contact Us
            </button>
          </div>

          {/* Image Section */}
          <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
            {/* Background Images */}
            <div className="absolute bottom-0 left-0 w-4/5 md:w-[350px] h-3/5 md:h-[350px] rounded-3xl overflow-hidden shadow-lg z-10">
              <Image
                src="/img/a2.png"
                alt="Team collaboration"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute top-0 right-0 w-4/5 md:w-[350px] h-3/5 md:h-[350px] rounded-3xl overflow-hidden shadow-lg z-0">
              <Image
                src="/img/a1.png"
                alt="Event venue"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
