import SingleEvent from "@/components/events/SingleEvent";
import Event from "@/types/event";

export interface EventPageParams {
  id: string;
}

export default async function EventPage({
  params,
}: {
  params: EventPageParams;
}) {
  const { id } = params;

  if (!id) {
    return <p>Event ID not found.</p>;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch event");
    }

    const event: Event = await response.json();

    return (
      <div>
        <SingleEvent event={event} />
      </div>
    );
  } catch (error) {
    return <p>Error fetching event: {(error as Error).message}</p>;
  }
}
