"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/Redux/features/authSlice";
import { useDispatch } from "react-redux";
import { FiMenu, FiX } from "react-icons/fi"; // Icons for toggle button

interface SideBar {
  href: string;
  label: string;
}

const sideBarLinks: SideBar[] = [
  { href: "/profile/organizer/my-profile", label: "Profile" },
  { href: "/profile/organizer/events", label: "Events" },
  { href: "/profile/organizer/customers", label: "Customers" },
  { href: "/profile/organizer/analytics", label: "Analytics" },
  { href: "/profile/organizer/wallet", label: "Wallet" },
];

const OrganizerSideBar = () => {
  const router = useRouter();
  const pathname = usePathname() || "/profile/organizer/my-profile"; 
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state

  useEffect(() => {
    if (!sideBarLinks.some((link) => link.href === pathname)) {
      router.replace("/profile/organizer/my-profile");
    }
  }, [pathname, router]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNavClick = (href: string) => {
    router.push(href);
    setIsSidebarOpen(false); // Close sidebar on mobile after clicking a link
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden text-white fixed mt-28 left-4 z-50 bg-[#333] p-2 rounded-md"
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative lg:top-0  top-36 left-0   bg-[#1F1F1F] text-white lg:mt-28 rounded-3xl md:rounded-l-3xl flex flex-col justify-between p-4 transition-transform transform ${
          isSidebarOpen ? "translate-x-0 z-50" : "-translate-x-full "
        } lg:translate-x-0 w-64 z-40 `}
      >
        {/* Navigation */}
        <nav className="flex flex-col space-y-10 mt-6 flex-grow">
          {sideBarLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`transition-all font-kulim duration-300 text-xl font-medium ${
                pathname === link.href
                  ? "text-[#03DAC6] underline bg-[#575757] p-2 w-[80%] md:w-[60%] rounded-full mx-auto"
                  : "text-white hover:text-[#6200EE] hover:underline"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="md:mt-0 mt-20 transition-all font-kulim duration-300 text-xl font-medium text-[#CF6679] hover:text-red-700 rounded-full border-2 border-[#CF6679] hover:border-red-700 w-[80%] md:w-[60%] mx-auto p-2 mb-4"
        >
          Log Out
        </button>
      </div>
    </>
  );
};

export default OrganizerSideBar;
