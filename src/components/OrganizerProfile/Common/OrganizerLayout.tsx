"use client";
import React from "react";
import OrganizerSideBar from "./OrganizerSideBar";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const OrganizerLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <div className="flex flex-col lg:flex-row px-4 lg:px-10 ">
      <OrganizerSideBar />
      <main className="flex-1 overflow-y-auto ml-0 lg:ml-1">{children}</main>
    </div>
    </div>
  );
};

export default OrganizerLayout;
