import React from 'react';
import { X, Facebook, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1F1F1F] text-gray-300 py-8 sm:py-12">
      <div className="px-4 sm:px-8 md:px-16 lg:px-28 mx-auto">
        {/* Main Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-white font-lexend text-xl sm:text-2xl font-semibold mb-4">NextEvent</h3>
            <div className="space-y-2">
              <p className="text-base sm:text-lg text-[#888888] font-kulim">+94 3322 83273</p>
              <p className="text-base sm:text-lg text-[#888888] font-kulim">nextEvent@hotmail.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-lexend text-xl sm:text-2xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-base sm:text-lg font-kulim hover:text-white transition-colors text-[#888888]">Home</a></li>
              <li><a href="#about" className="text-base sm:text-lg font-kulim hover:text-white transition-colors text-[#888888]">About Us</a></li>
            </ul>
          </div>

          {/* Additional Links */}
          <div className="space-y-4">
            <ul className="space-y-2 mt-0 sm:mt-10">
              <li><a href="#event" className="text-base sm:text-lg font-kulim hover:text-white transition-colors text-[#888888]">Events</a></li>
              <li><a href="#contact" className="text-base sm:text-lg font-kulim hover:text-white transition-colors text-[#888888]">Contact Us</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <div className="flex max-w-full sm:max-w-md lg:max-w-full">
              <input
                type="email"
                placeholder="Get Event Update"
                className="w-full px-3 sm:px-4 py-2 bg-transparent border border-gray-600 rounded-l-md focus:outline-none focus:border-purple-500"
              />
              <button className="bg-[#6200EE] px-3 sm:px-4 py-2 rounded-r-md hover:bg-purple-700 transition-colors">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-400">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row justify-between items-center">
            {/* Social Links */}
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="hover:text-white transition-colors border rounded-full p-1 sm:px-1 sm:py-1">
                <Facebook size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors border rounded-full p-1 sm:px-1 sm:py-1">
                <Linkedin size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors border rounded-full p-1 sm:px-1 sm:py-1">
                <Instagram size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors border rounded-full p-1 sm:px-1 sm:py-1">
                <X size={18} className="sm:w-5 sm:h-5" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-sm sm:text-base text-[#888888] font-kulim text-center sm:text-left">
              <p>A Product of NextEvent</p>
            </div>

            {/* All Rights Reserved */}
            <div className="text-sm sm:text-base text-[#888888] font-kulim text-center sm:text-left">
              <p>© 2025 NextEvent. All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;