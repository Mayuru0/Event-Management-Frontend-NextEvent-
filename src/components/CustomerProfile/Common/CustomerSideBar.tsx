"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logout, selectRefreshToken, selectuser } from "@/Redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutUserMutation } from "@/Redux/features/authApiSlice";
import { Menu, X, User, Ticket, CreditCard, LogOut } from "lucide-react";
import Image from "next/image";

interface SideBarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const sideBarLinks: SideBarLink[] = [
  { href: "/profile/customer/my-profile", label: "My Profile", icon: <User className="w-4 h-4" /> },
  { href: "/profile/customer/my-tickets", label: "My Tickets", icon: <Ticket className="w-4 h-4" /> },
  { href: "/profile/customer/save-cards", label: "Save Cards", icon: <CreditCard className="w-4 h-4" /> },
];

const CustomerSideBar = () => {
  const router = useRouter();
  const pathname = usePathname() || "/profile/customer/my-profile";
  const dispatch = useDispatch();
  const refreshToken = useSelector(selectRefreshToken);
  const user = useSelector(selectuser);
  const [logoutUser] = useLogoutUserMutation();
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false);
  };

  const handleLogout = async () => {
    if (refreshToken) {
      try {
        await logoutUser({ refreshToken }).unwrap();
      } catch {
        // proceed with local logout even if server call fails
      }
    }
    dispatch(logout());
    router.push("/");
  };

  if (!isClient) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-24 left-4 z-50 bg-[#1F1F1F] border border-white/10 text-white p-2.5 rounded-xl shadow-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-0 lg:top-auto left-0 h-screen lg:h-auto w-72 lg:w-64 flex flex-col bg-[#161616] lg:bg-[#1A1A1A] border-r border-white/5 lg:border-none lg:rounded-3xl lg:rounded-r-none lg:mt-28 transition-transform duration-300 z-10 shadow-2xl lg:shadow-none overflow-hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* User Info — gradient header */}
        <div className="relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00897B]/35 via-[#00695C]/20 to-transparent" />
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#03DAC6]/12 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[#03DAC6]/40 via-[#03DAC6]/10 to-transparent" />

          <div className="relative p-5 pb-6">
            {/* Avatar */}
            <div className="relative w-16 h-16 mb-3.5">
              <div className="w-full h-full rounded-2xl overflow-hidden ring-2 ring-[#03DAC6]/40 ring-offset-2 ring-offset-[#161616] lg:ring-offset-[#1A1A1A]">
                <Image
                  src={
                    user?.profilePic && user.profilePic.startsWith("http")
                      ? user.profilePic
                      : "/default-profile.png"
                  }
                  alt={user?.name || "User"}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Online indicator */}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#161616] lg:border-[#1A1A1A] shadow-lg" />
            </div>

            {/* Name + email */}
            <p className="text-sm font-bold text-white truncate leading-tight">{user?.name || "User"}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs font-semibold text-[#03DAC6]">Customer</span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span className="text-[10px] text-gray-500 truncate max-w-[110px]">{user?.email || ""}</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600 px-3 pb-3 pt-1">Menu</p>
          {sideBarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left group ${
                  isActive
                    ? "bg-gradient-to-r from-[#03DAC6]/15 to-[#03DAC6]/5 text-white"
                    : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                {/* Left accent bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-gradient-to-b from-[#03DAC6] to-[#6200EE]" />
                )}
                <span className={`shrink-0 transition-colors ${isActive ? "text-[#03DAC6]" : "text-gray-600 group-hover:text-gray-400"}`}>
                  {link.icon}
                </span>
                <span className="flex-1">{link.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#03DAC6] shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-[#CF6679] hover:bg-[#CF6679]/8 transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 shrink-0 group-hover:text-[#CF6679] transition-colors" />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomerSideBar;
