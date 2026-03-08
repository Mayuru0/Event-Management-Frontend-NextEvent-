"use client";

import React from "react";
import CustomerSideBar from "./CustomerSideBar";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0E0E0E] ">
      <div className="flex flex-col lg:flex-row px-4 lg:px-8 gap-0 lg:gap-4 mb-20">
        <CustomerSideBar />
        <main className="flex-1 overflow-y-auto min-w-0">{children}</main>
      </div>
    </div>
  );
};

export default CustomerLayout;
