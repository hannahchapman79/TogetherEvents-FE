"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";

export default function DeleteEventButton({ eventId }: { eventId: string }) {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user?.isAdmin) {
    return null;
  }

  const deleteEvent = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (error) {
      setError("Failed to delete event. Please try again.");
    } finally {
      setLoading(false);
      router.push("/events");
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={deleteEvent}
        disabled={loading}
        className={`mt-4 flex items-center gap-2 text-white bg-accent-3 hover:bg-accent-3-hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <MdDeleteOutline className="w-5 h-5" />
        {loading ? "Deleting..." : <>Delete Event</>}
      </button>
    </div>
  );
}
