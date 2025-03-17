"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/Redux/features/authSlice";
import { useDispatch } from "react-redux";
import { Menu } from "lucide-react"; // Import an icon for mobile menu toggle

interface SideBar {
  href: string;
  label: string;
}

const sideBarLinks: SideBar[] = [
  { href: "/profile/customer/my-profile", label: "My Profile" },
  { href: "/profile/customer/my-tickets", label: "My Tickets" },
  { href: "/profile/customer/save-cards", label: "Save Cards" },
];

const CustomerSideBar = () => {
  const router = useRouter();
  const pathname = usePathname() || "/profile/customer/my-profile"; 
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // For mobile sidebar toggle

  useEffect(() => {
    if (!sideBarLinks.some((link) => link.href === pathname)) {
      router.replace("/profile/customer/my-profile");
    }
  }, [pathname, router]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNavClick = (href: string) => {
    router.push(href);
    setIsOpen(false); // Close menu on mobile after clicking a link
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
      {/* Mobile Menu Toggle Button */}
      <button
        className="lg:hidden text-white p-2 mt-24  "
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={30} />
      </button>

      {/* Sidebar */}
      <div
        className={`absolute lg:relative top-36 md:top-0 left-0 h-2/6 w-64 bg-[#1F1F1F] text-white rounded-3xl  md:rounded-l-3xl flex flex-col justify-between p-4 transition-transform duration-300  ${
          isOpen ? "translate-x-0 z-50 " : "-translate-x-full lg:translate-x-0"
        } lg:flex lg:h-auto lg:mt-28`}
      >
        <nav className="flex flex-col space-y-6 mt-6">
          {sideBarLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`transition-all font-kulim duration-300 text-lg font-medium ${
                pathname === link.href
                  ? "text-[#03DAC6] underline bg-[#575757] p-2 w-[80%] rounded-full mx-auto"
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
          className="transition-all font-kulim duration-300 text-lg font-medium text-[#CF6679] hover:text-red-700 rounded-full border-2 border-[#CF6679] hover:border-red-700 w-[80%] mx-auto p-2 mb-4"
        >
          Log Out
        </button>
      </div>
    </>
  );
};

export default CustomerSideBar;
