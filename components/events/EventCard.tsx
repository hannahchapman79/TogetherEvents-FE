"use client";

import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import Link from "next/link";

interface EventCardProps {
  id: string;
  name: string;
  startDate: string;
  image: string | undefined;
  category: string | null;
  location: string;
}

const categoryImages: Record<string, string> = {
  "Arts & Creativity": "/arts.jpg",
  "Book Club": "/books.jpg",
  Networking: "/networking.jpg",
  Entertainment: "/entertainment.jpg",
  "Health & Wellness": "/wellness.jpg",
  "Outdoors & Adventure": "/outdoors.jpg",
  Education: "education.jpg",
};

export default function EventCard({
  id,
  name,
  startDate,
  image,
  category,
  location,
}: EventCardProps) {
  const eventImage = image || categoryImages[category || ""] || "/default.jpg";

  return (
    <Card className="w-full h-full flex flex-col justify-center max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 m-6">
      <Link className="w-full h-full" href={`/events/${id}`}>
        <div className="relative w-full h-[180px]">
          <Image
            alt="Card background"
            className="w-full h-full object-cover rounded-t-lg pb-12 hover:scale-110 ease-in duration-150"
            src={eventImage}
            width={400}
            height={220}
          />
        </div>

        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">{category}</p>
          <p className="text-default-500">{startDate}</p>
          <h4 className="font-bold text-large">{name}</h4>
        </CardHeader>

        <CardBody className="overflow-visible py-2 flex justify-center"></CardBody>
      </Link>
    </Card>
  );
}
