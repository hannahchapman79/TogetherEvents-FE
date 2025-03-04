"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { CiEdit } from "react-icons/ci";

export default function EditEventButton({ eventId }: { eventId: string }) {
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <>
      <Link href={`edit/${eventId}`}>
        <button className="mt-4 flex items-center gap-2 text-white bg-accent-3 hover:bg-accent-3-hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
          <CiEdit className="w-5 h-5" />
          Edit Event
        </button>
      </Link>
    </>
  );
}
