import EventsList from "@/components/events/EventsList";
import AddEventButton from "@/components/events/AddEventButton";

async function getEvents() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    cache: "no-store",
  });
  const data = await response.json();
  return data;
}

export default async function EventsPage() {
  const { events } = await getEvents();

  return (
    <div className="container mx-auto px-4 mt-16">
          <AddEventButton/>
      <h1 className="text-3xl font-bold text-center my-6">Events</h1>
      {Array.isArray(events) && events.length > 0 ? (
        <EventsList events={events} />
      ) : (
        <p className="text-center text-gray-500">No events found.</p>
      )}
    </div>
  );
}
