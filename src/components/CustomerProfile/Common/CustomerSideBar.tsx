"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {  logout } from "@/Redux/features/authSlice";
import {  useDispatch } from "react-redux";

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
  const pathname = usePathname() || "/profile/customer/my-profile"; // Default path
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false); 
  

  // Redirect to default if the current path is invalid
  useEffect(() => {
    if (!sideBarLinks.some((link) => link.href === pathname)) {
      router.replace("/profile/customer/my-profile");
    }
  }, [pathname, router]);

  const handleNavClick = (href: string) => {
    router.push(href);
  };

  useEffect(() => {
    setIsClient(true); // Set to true when client-side render is complete
  }, []);

  const handleLogout = () => {
    dispatch(logout());  // Log out the user
    router.push("/");  // Redirect to login page after logout
  };
  

  if (!isClient) {
    return null; // Return nothing before the client-side rendering
  }


  return (
    <div className=" w-64 bg-[#1F1F1F] text-white mt-28 rounded-l-3xl flex flex-col justify-between p-4">
      {/* Navigation */}
      <nav className="flex flex-col space-y-10 mt-6 flex-grow">
        {sideBarLinks.map((link) => (
          <button
            key={link.href}
            onClick={() => handleNavClick(link.href)}
            className={`transition-all font-kulim duration-300 text-xl font-medium  ${
              pathname === link.href
                ? "text-[#03DAC6] underline bg-[#575757] p-2 w-[60%] rounded-full ml-11"
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
      className="transition-all font-kulim duration-300 text-xl font-medium text-[#CF6679] hover:text-red-700 rounded-full border-2 border-[#CF6679]  hover:border-red-700 w-[60%] ml-11 p-2 mb-4">
        Log Out
      </button>
    </div>
  );
};

export default CustomerSideBar;
