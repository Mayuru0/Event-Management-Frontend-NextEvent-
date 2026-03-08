"use client";

import ItemInfo from '@/components/Event/Events/ItemInfor';
import { useGetEventByIdQuery } from '@/Redux/features/eventApiSlice';
import { useParams } from 'next/navigation';
import React from 'react';

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading, isError } = useGetEventByIdQuery(id as string);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#6200EE] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading event...</p>
        </div>
      </div>
    );
  }

  if (isError || !response?.success || !response.data) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
        <p className="text-red-400 text-sm font-medium">Failed to load event.</p>
      </div>
    );
  }

  const event = response.data;

  return (
    <div>
      <ItemInfo
        _id={event._id}
        title={event.title}
        ticket_price={event.ticket_price}
        description={event.description}
        date={event.date}
        event_type={event.event_type}
        image={event.image}
        location={event.location}
        organizerid={event.organizerid}
        popularity={event.popularity}
        quantity={event.quantity}
        status={event.status}
      />
    </div>
  );
};

export default Page;
