"use client";

import React from "react";
import CustomerSideBar from "./CustomerSideBar";



interface ProfileLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  


  return (
    <div className="flex flex-col h-screen bg-[#121212]">
  
      <div className="flex flex-  px-10 ">
        <CustomerSideBar />
        <main className="flex-1 overflow-y-auto ml-1">{children}</main>
      </div>
    </div>
  );
};

export default CustomerLayout;
