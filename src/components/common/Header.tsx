"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { selectuser, logout } from "@/Redux/features/authSlice";

interface NavLink {
  href: string;
  label: string;
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const router = useRouter();
  const user = useSelector(selectuser);
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const navigationLinks: NavLink[] = [
    { href: "home", label: "Home" },
    { href: "about", label: "About" },
    { href: "event", label: "Events" },
    { href: "contact", label: "Contact" },
  ];

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const scrollPosition = window.scrollY;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (
          scrollPosition >= sectionTop - 50 &&
          scrollPosition < sectionTop + sectionHeight - 50
        ) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    setActiveSection(href);
    const element = document.getElementById(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  const handleAuthClick = (type: "signin" | "signup") => {
    router.push(`/auth/${type}`);
    setIsOpen(false);
  };
  useEffect(() => {
    setIsClient(true); // Set to true when client-side render is complete
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };
  
  if (!isClient) {
    return null; // Return nothing before the client-side rendering
  }

  const handleProfileClick = () => {
    const profileRoute =
      user?.role === "customer"
        ? "/profile/customer/my-profile"
        : "/profile/organizer/my-profile";
    router.push(profileRoute);
    setIsOpen(false);
  };

  if (!isMounted) return null;
  return (
    <header className="w-full fixed top-0 left-0 right-0 bg-transparent backdrop-blur-sm z-50 border-b border-white/10">
      <div className="mx-auto w-full">
        <div className="flex h-16 px-4 lg:px-24 items-center justify-between">
          <h1 className="text-2xl font-semibold text-white font-lexend">
            <button onClick={() => router.push("/")}>NextEvent</button>
          </h1>

          <div className="hidden lg:flex flex-1 justify-center">
            <nav className="flex space-x-8 items-center">
              {navigationLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`transition-all duration-300 text-base font-medium ${
                    activeSection === link.href
                      ? "text-[#6200EE] underline"
                      : "text-white hover:text-[#03DAC6] hover:underline"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <button onClick={handleProfileClick} className="flex items-center space-x-3">
                  <span className="text-white text-sm font-medium">{user.name}</span>
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={user?.profilePic || "/default-profile.png"}
                      fill
                      alt={user?.name || "User Profile"}
                      className="object-cover rounded-full"
                    />
                  </div>
                </button>
                
              </div>
            ) : (
              <>
                <button onClick={() => handleAuthClick("signup")} className="text-white">Sign up</button>
                <button onClick={() => handleAuthClick("signin")} className="text-white">Sign in</button>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white focus:outline-none">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden bg-black/95 lg:hidden"
        >
          <nav className="flex flex-col space-y-4 py-4 px-6">
            {user && (
              <button onClick={handleProfileClick} className="flex items-center space-x-3">
                <Image src={user?.profilePic || "/placeholder.svg"} alt="Profile" width={40} height={40} className="rounded-full" />
                <span className="text-white text-sm font-medium">{user.name}</span>
              </button>
            )}
            {navigationLinks.map((link) => (
              <button key={link.href} onClick={() => handleNavClick(link.href)} className="text-white">
                {link.label}
              </button>
            ))}
            {user ? (
              <button onClick={handleLogout} className="text-white">Logout</button>
            ) : (
              <>
                <button onClick={() => handleAuthClick("signup")} className="text-white">Sign up</button>
                <button onClick={() => handleAuthClick("signin")} className="text-white">Sign in</button>
              </>
            )}
          </nav>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;