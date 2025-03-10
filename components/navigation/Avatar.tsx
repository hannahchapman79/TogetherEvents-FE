"use client";

import { useAuth } from "@/context/AuthContext";

export default function Avatar() {
  const { user } = useAuth();
  const username = user?.username || "";

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
      <span className="font-medium text-gray-600">
        {username ? getInitial(username) : "?"}
      </span>
    </div>
  );
}
