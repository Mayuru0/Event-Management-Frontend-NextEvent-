"use client";
import OrganizerLayout from '@/components/OrganizerProfile/Common/OrganizerLayout';
import OrganizerEvents from '@/components/OrganizerProfile/OrganizerEvent';
import RightSidebar from '@/components/OrganizerProfile/sidePanel/eventViewSidePanel';
import React, { useState } from 'react';
import { Event } from "@/type/EventType";


const Page: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleView = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseSidebar = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      <OrganizerLayout>
        <OrganizerEvents onView={handleView} />
      </OrganizerLayout>
      {selectedEvent && <RightSidebar event={selectedEvent} onClose={handleCloseSidebar} />}
    </>
  );
};

export default Page;
