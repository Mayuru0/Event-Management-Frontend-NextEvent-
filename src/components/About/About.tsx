import React from 'react'
import Image from "next/image"
import { Kulim_Park, Raleway } from "next/font/google";

  const raleway = Raleway({
    subsets: ["latin"], // Supports Latin characters
    weight: ["200", "300", "400", "500", "600", "700", "800"], // Select needed weights
    });

    const KulimPark = Kulim_Park({
      subsets: ["latin"], // Specifies character subset
      weight: ["200", "300", "400"], // Select needed weights
    });

const About = () => {
  return (
    <div className="min-h-screen text-white py-16 px-4 md:px-6 lg:px-8" style={{ backgroundColor: '#121212' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-2 items-center">


        <div className="max-w-xl lg:max-w-2xl ml-auto mr-36 text-right">
            <p className="text-sm uppercase tracking-wider mb-4 text-white">About Us</p>
            <h1 className={`text-5xl md:text-5xl font-normal mb-8 ${raleway.className}`}>Who We Are</h1>
            <p className={`text-gray-300 font-normal text-lg leading-relaxed mb-8 max-w-xl ${KulimPark.className}`}>
              At the heart of our platform is a passion for bringing people together through extraordinary events. We
              specialize in connecting event organizers and attendees, ensuring seamless experiences from start to
              finish. With innovative collaboration and a commitment to excellence, we create opportunities to
              celebrate, learn, and inspire.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full">
              Contact Us
            </button>
          </div>

          <div className="relative w-full h-[700px]">

            <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-3xl overflow-hidden shadow-lg z-20">
              <Image
                src="/img/a2.png"
                alt="Team collaboration"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-3xl overflow-hidden shadow-lg z-0">
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
  )
}

export default About
