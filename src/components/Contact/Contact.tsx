import React from "react";
import Image from "next/image";

function Contact() {
  return (
    <div>
      <div className="text-white md:py-28 py-16 bg-[#121212] font-raleway">
        <div className="px-6 md:px-12 mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Left Section */}
          <div className="relative mx-auto max-w-lg">
            <div>
              <Image
                src="/images/contactImage.png"
                alt="Contact Image"
                width={700}
                height={700}
                className="w-full h-[450px] md:h-[600px] rounded-xl object-cover"
              />
            </div>

            <div className="absolute top-5 left-5 bg-black bg-opacity-50 p-5 rounded-lg md:w-4/5">
              <h2 className="lg:text-[48px] text-[32px] font-bold">Get in touch</h2>

              {/* Chat Section */}
              <div className="mt-4">
                <h3 className="font-bold text-xl md:text-2xl">Chat with Us</h3>
                <p className="text-[#B0B0B0] text-sm md:text-lg">
                  Our friendly team is here to help
                </p>
                <p className="font-bold text-sm md:text-lg">nextEvents@hotmail.com</p>
              </div>

              {/* Call Section */}
              <div className="mt-6">
                <h3 className="font-bold text-xl md:text-2xl">Call Us</h3>
                <p className="text-[#B0B0B0] text-sm md:text-lg">Mon - Fri from 8am to 5pm</p>
                <p className="font-bold text-sm md:text-lg">+64 3322 83773</p>
              </div>

              {/* Social Media */}
              <div className="mt-6">
                <h3 className="font-bold text-xl md:text-2xl">Social Media</h3>
                <div className="flex space-x-3 mt-2">
                  {["fb", "in", "ins", "x"].map((icon, index) => (
                    <a key={index} href="#" className="hover:text-white">
                      <Image src={`/images/${icon}.png`} width={30} height={30} alt={icon} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <form className="space-y-5 max-w-lg mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm md:text-base mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full px-4 py-2 text-sm md:text-base bg-transparent border border-white rounded-lg"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm md:text-base mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full px-4 py-2 text-sm md:text-base bg-transparent border border-white rounded-lg"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm md:text-base mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 text-sm md:text-base bg-transparent border border-white rounded-lg"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm md:text-base mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                className="w-full px-4 py-2 text-sm md:text-base bg-transparent border border-white rounded-lg"
                placeholder="+64 3322 83773"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm md:text-base mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-2 text-sm md:text-base bg-transparent border border-white rounded-lg"
                placeholder="Refund Event Ticket"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm md:text-base mb-1">
                Reason
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-2 text-sm md:text-base bg-transparent border border-white rounded-lg"
                placeholder="Type your message here..."
              />
            </div>

            <button
              type="submit"
              className="w-full text-lg md:text-xl bg-[#6200EE] text-white py-3 rounded-lg hover:bg-[#6329b4] transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
