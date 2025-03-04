import Link from "next/link";
import Event from "@/types/event";

interface SingleEventProps {
  event: Event;
}

export default function GoogleCalendarButton({ event }: SingleEventProps) {
  const createGoogleCalendarUrl = () => {
    const startingDate = new Date(event.startDate);
    const formatStartDate = startingDate.toISOString().replace(/[^\w\s]/gi, "");

    const endDate = event.endDate
      ? new Date(event.endDate)
      : new Date(startingDate.getTime() + 2 * 60 * 60 * 1000);
    const formatEndDate = endDate.toISOString().replace(/[^\w\s]/gi, "");

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      details: event.description,
      dates: `${formatStartDate}/${formatEndDate}`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <Link target="_blank" href={createGoogleCalendarUrl()}>
      <button className="mt-4 flex items-center gap-2 text-white bg-accent-3 hover:bg-accent-3-hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
        <img src="/google-calendar.png" alt="Google Calendar" className="w-5 h-5" />
        Add to Google Calendar
      </button>
    </Link>
  );
}
