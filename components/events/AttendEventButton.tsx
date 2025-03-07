"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function AttendEventButton({ eventId }: { eventId: string }) {
  const { user, accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAttendEvent = async () => {
    if (!user || !accessToken) {
      setError("Please log in to attend this event");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/signup`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log(response.status);
      if (response.status !== 201) {
        throw new Error("Failed to attend event");
      }

      setSuccess(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || error.message || "An error occurred";
        setError(errorMessage);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleAttendEvent}
        className="mt-4 text-white bg-accent-3 hover:bg-accent-3-hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        {loading ? "Attending..." : "Attend Event"}
      </button>

      {error && (
        <p
          role="alert"
          className="mt-2 p-4 mb-5 text-sm text-red-800 rounded-lg bg-red-50"
        >
          {error}
        </p>
      )}

      {success && <p className="text-green-500 mt-2">You are attending!</p>}
    </div>
  );
}
