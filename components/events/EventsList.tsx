"use client";

import EventCard from "./EventCard";
import Event from "../../types/event"

interface EventsListProps {
  events: Event[];
}

export default function EventsList({ events }: EventsListProps) {
  return (
    <div className="place-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event._id}
          id={event._id}
          name={event.title}
          startDate={new Date(event.startDate).toLocaleDateString()}
          image={event.image} 
          category={event.category}
          location={event.location.type}
        />
      ))}
    </div>
  );
}