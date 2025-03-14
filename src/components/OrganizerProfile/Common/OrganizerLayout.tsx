"use client";
import React from "react";
import OrganizerSideBar from "./OrganizerSideBar";



interface ProfileLayoutProps {
  children: React.ReactNode;
}

const OrganizerLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  


  return (
    <div className="flex flex-col h-[1100px] bg-[#121212]">
  
      <div className="flex flex-  px-10 ">
        <OrganizerSideBar />
        <main className="flex-1 overflow-y-auto ml-1">{children}</main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
