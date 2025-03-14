"use client"; 

import ItemInfo from '@/components/Event/Events/ItemInfor';
import { useGetEventByIdQuery } from '@/Redux/features/eventApiSlice';
import { useParams } from 'next/navigation';
import React from 'react';

const Page = () => {
  const { id } = useParams<{ id: string }>(); 
  const { data: response, isLoading, isError } = useGetEventByIdQuery(id as string);

  console.log(response, isLoading);

  if (isLoading) {
    return <p className="text-center text-xl font-semibold text-white relative -mt-[20%]">Loading event...</p>;
  }

  if (isError || !response?.success || !response.data) {
    return <p className="text-center text-red-500 text-lg font-semibold">Failed to load event.</p>;
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
        //organizerId={event.organizerid}
        popularity={event.popularity}
        quantity={event.quantity}
        status={event.status}
      />
    </div>
  );
};

export default Page;
