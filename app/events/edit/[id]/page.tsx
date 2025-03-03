"use client";

import { useParams } from "next/navigation";
import EditEventForm from "@/components/events/admin/EditEventForm";

export default function EditEventPage() {
  const params = useParams();
  const eventId = params?.id as string; 

  return <EditEventForm eventId={eventId} />;
}