"use client";

import { useState, useEffect } from "react";
import { Menu, X,  } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
//import profilpic from "../../../public/profile/profiePic.png";
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
  // // Mock user state

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
      router.push(`/`);
    }
  };

  const handleAuthClick = (type: "signin" | "signup") => {
    router.push(`/auth/${type}`);
    setIsOpen(false);
  };

  // const handleLogout = () => {
  //   // Implement logout logic here
  //   setUser({ ...user, isLoggedIn: false });
  //   router.push('/');
  // };

  useEffect(() => {
    setIsClient(true); // Set to true when client-side render is complete
  }, []);
  const handleLogout = () => {
    dispatch(logout());
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
        <div className="flex h-16 px-4 lg:px-24">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-semibold text-white font-lexend">
              <button onClick={() => router.push("/")}>NextEvent</button>
            </h1>
          </div>

          {/* Navigation for larger screens - Centered */}
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

          {/* Authentication or User Profile for larger screens */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-3 px-4 py-1.5 rounded-full  transition-colors duration-300"
                >
                  <span className="text-white text-sm font-medium">
                    {user.name}
                  </span>
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={
                        user?.profilePic && user?.profilePic.startsWith("http")
                          ? user.profilePic
                          : "/default-profile.png"
                      }
                      fill
                      alt={user?.name || "User Profile"}
                      className="object-cover rounded-full"
                    />
                  </div>
                </button>
                {/* <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-[#6200EE] rounded-full hover:bg-[#5000c1] transition-colors duration-300"
                >
                  Logout
                </button> */}
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleAuthClick("signup")}
                  className="px-4 py-1.5 text-sm font-medium text-white rounded-full border border-white/50 hover:bg-white/10 transition-colors duration-300"
                >
                  Sign up
                </button>
                <button
                  onClick={() => handleAuthClick("signin")}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-[#6200EE] rounded-full hover:bg-[#5000c1] transition-colors duration-300"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          {/* Hamburger Menu for mobile screens */}
          <div className="lg:hidden flex items-center ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden bg-black/95 lg:hidden"
        >
          <nav className="flex flex-col space-y-4 py-4">
            {user?.isLoggedIn && (
              <button
                onClick={handleProfileClick}
                className="px-6 py-2 flex items-center space-x-3 hover:bg-white/10 transition-colors duration-300"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={user?.profilePic || "/placeholder.svg"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover"
                    priority
                  />
                </div>
                <span className="text-white text-sm font-medium">
                  {user.name}
                </span>
              </button>
            )}
            {navigationLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`transition-all duration-300 px-6 py-2 text-left text-sm font-medium ${
                  activeSection === link.href
                    ? "text-[#6200EE]"
                    : "text-white hover:text-[#6200EE]"
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="flex flex-col space-y-2 px-6 pt-4">
              {user?.isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-[#6200EE] rounded-full hover:bg-[#5000c1] transition-colors duration-300"
                >
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick("signup")}
                    className="w-full px-4 py-2 text-sm font-medium text-white rounded-full border border-white/20 hover:bg-white/10 transition-colors duration-300"
                  >
                    Sign up
                  </button>
                  <button
                    onClick={() => handleAuthClick("signin")}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-[#6200EE] rounded-full hover:bg-[#5000c1] transition-colors duration-300"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </nav>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
