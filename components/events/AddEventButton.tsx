"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AddEventButton() {
    const { user } = useAuth();

    if (!user?.isAdmin) {
        return null;
    }

    return (
        <>
        <Link
        href={'/events/new'}>
        <button
            className="fixed bottom-4 right-4 bg-accent-3 hover:bg-accent-3-hover text-white font-medium rounded-full p-4 shadow-lg flex items-center justify-center"
            >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 4v16m8-8H4" 
                    />
            </svg>
            Add New Event
        </button>
                    </Link>
                    </>
    );
}