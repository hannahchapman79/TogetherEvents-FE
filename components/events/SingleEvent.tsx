import Event from "@/types/event";
import GoogleCalendarButton from "./AddToCalendarButton";

interface SingleEventProps {
  event: Event;
}

export default function SingleEvent({ event }: SingleEventProps) {
  return (
    <div className="p-6 mt-16 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
      <p className="text-gray-700 mt-2">{event.description}</p>
      <p className="text-sm text-gray-500 mt-4">
        Date: {new Date(event.startDate).toLocaleDateString()}
      </p>
      <GoogleCalendarButton event={event} />
    </div>
  );
}
