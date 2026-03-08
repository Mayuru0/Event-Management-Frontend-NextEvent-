"use client";

import React from "react";
import OrganizerSideBar from "./OrganizerSideBar";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const OrganizerLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0E0E0E]">
      <div className="flex flex-col lg:flex-row px-4 lg:px-8 gap-0 lg:gap-4 mb-20 min-h-screen">
        <OrganizerSideBar />
        <main className="flex-1 overflow-y-auto min-w-0">{children}</main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
