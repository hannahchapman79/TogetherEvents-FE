import EventsList from "@/components/events/EventsList";
import AddEventButton from "@/components/events/AddEventButton";

async function getEvents(category?: string) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/events`);
  if (category) {
    url.searchParams.append("category", category);
  }

  const response = await fetch(url.toString(), { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;
  const category = typeof params?.category === 'string' ? params.category : '';

  const formattedCategory =
    category ? category.charAt(0).toUpperCase() + category.slice(1) : "";
  
  const { events } = await getEvents(category);

  return (
    <div className="container mx-auto px-4 mt-16">
      <AddEventButton />
      <h1 className="text-3xl font-bold text-center my-6">
        {formattedCategory ? `${formattedCategory} Events` : "All Events"}
      </h1>
      {Array.isArray(events) && events.length > 0 ? (
        <EventsList events={events} />
      ) : (
        <p className="text-center text-gray-500">No events found.</p>
      )}
    </div>
  );
}