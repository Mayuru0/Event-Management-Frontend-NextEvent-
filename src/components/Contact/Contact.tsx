import React from "react";
import Image from "next/image";


function Contact() {
  return (
    <div>
      <div className="text-white py-28 bg-[#121212] font-raleway">
        <div className="px-12 mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Left Section */}
          <div className="relative mx-8">

            <div className="flex-1 ">
              <Image
                src="/images/contactImage.png"
                alt="Contact Image"
                width={700}
                height={700}
                className="w-full h-[600px] rounded-xl"
              />
            </div>

            <div className="absolute top-0 px-5 py-6">
              <h2 className="text-[48px] font-bold">Get in touch</h2>
              {/* Chat Section */}
              <div>
                <h3 className="font-bold mb-2 mt-4 text-2xl">Chat with Us</h3>
                <p className="text-[#B0B0B0] text-[18px] font-normal font-kulim">
                  Our friendly team is here to help
                </p>
                <p className="text-[18px] mt-[-4px] font-bold">nextEvents@hotmail.com</p>
              </div>

              {/* Call Section */}
              <div>
                <h3 className="text-[24px] font-bold mb-1 mt-8">Call Us</h3>
                <p className="text-[#B0B0B0] text-[18px] font-normal font-kulim">Mon - Fri from 8am to 5pm</p>
                <p className="text-[18px] mt-[-4px] font-bold font-raleway">+64 3322 83773</p>
              </div>

              {/* Social Media Section */}
              <div>
                <h3 className="text-[24px] font-bold mb-1 mt-5">Social Media</h3>
                <div className="flex space-x-2">
                  <a href="#" className=" hover:text-white">
                    <Image src="/images/fb.png" width={35} height={35} alt="facebook" />
                  </a>
                  <a href="#" className=" hover:text-white">
                  <Image src="/images/in.png" width={35} height={35} alt="Linkedin" />
                  </a>
                  <a href="#" className=" hover:text-white">
                  <Image src="/images/ins.png" width={35} height={35} alt="instagram" />
                  </a>
                  <a href="#" className=" hover:text-white">
                  <Image src="/images/x.png" width={35} height={35} alt="X" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <form className="space-y-4 text-[18px] mx-8 font-normal font-kulim">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="text-[16px] w-full px-4 py-2 bg-transparent border border-white rounded-[4px]"
                  placeholder="John"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="text-[16px] w-full px-4 py-2 bg-transparent border border-white rounded-[4px]"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="text-[16px] w-full px-4 py-2 bg-transparent border border-white rounded-[4px]"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="contactNumber"
                className="block mb-1"
              >
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                className="text-[16px] w-full px-4 py-2 bg-transparent border border-white rounded-[4px]"
                placeholder="+64 3322 83773"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block mb-1"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="text-[16px] w-full px-4 py-2 bg-transparent border border-white rounded-[4px]"
                placeholder="Refund Event Ticket"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block mb-1"
              >
                Reason
              </label>
              <textarea
                id="message"
                rows={5}
                className="text-[16px] w-full px-4 py-2 mb-[-5px] bg-transparent border border-white rounded-[4px]"
                placeholder="Paul"
              />
            </div>

            <button
              type="submit"
              className="text-[20px] w-full bg-[#6200EE] text-white py-3 px-6 rounded-[4px] hover:bg-[#6329b4] transition-colors"
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
