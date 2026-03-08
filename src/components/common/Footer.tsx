import React from "react"
import { X, Facebook, Linkedin, Instagram, ArrowRight, Mail } from "lucide-react"
import DustParticles from "./DustParticles"

const quickLinks = [
  { href: "home", label: "Home" },
  { href: "about", label: "About Us" },
  { href: "event", label: "Events" },
  { href: "contact", label: "Contact" },
]

const platformLinks = ["Become an Organizer", "Browse Events", "Support", "Privacy Policy"]

const Footer = () => {
  return (
    <footer className="relative bg-[#06060E] text-gray-400 pt-16 pb-8 overflow-hidden">
      <DustParticles count={35} />

      {/* Top gradient rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6200EE]/55 to-transparent" />

      {/* Decorative orbs */}
      <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-[#6200EE]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-8 right-1/4 w-56 h-56 rounded-full bg-[#03DAC6]/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 px-6 sm:px-10 md:px-16 lg:px-28 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="space-y-5">
            <div>
              <h3 className="text-white text-2xl font-bold tracking-tight">
                Next
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6200EE] to-[#03DAC6]">
                  Event
                </span>
              </h3>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                Sri Lanka&apos;s premier event management platform connecting organizers and attendees.
              </p>
            </div>
            <div className="space-y-2">
              <a
                href="mailto:nextEvent@hotmail.com"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#03DAC6] transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                nextEvent@hotmail.com
              </a>
              <p className="text-sm text-gray-600 pl-6">+94 3322 83273</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={`#${href}`}
                    className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#6200EE] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2.5">
              {platformLinks.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#03DAC6] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest">Stay Updated</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Get the latest events delivered to your inbox.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2.5 bg-[#111118] border border-white/8 rounded-l-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#6200EE]/50 transition-colors"
              />
              <button className="px-4 py-2.5 bg-gradient-to-r from-[#6200EE] to-[#7B2FFF] hover:from-[#7B2FFF] hover:to-[#9040FF] rounded-r-lg transition-all text-white flex-shrink-0">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            {/* Social icons */}
            <div className="flex gap-3">
              {[Facebook, Linkedin, Instagram, X].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-600 hover:text-white hover:border-[#6200EE]/40 hover:bg-[#6200EE]/15 transition-all duration-300"
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>

            <p className="text-xs text-gray-700">A Product of NextEvent</p>

            <p className="text-xs text-gray-700">© 2025 NextEvent. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
