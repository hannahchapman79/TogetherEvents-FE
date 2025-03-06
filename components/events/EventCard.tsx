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
  description: string;
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
  description,
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
          <div className="flex justify-between w-full text-sm">
            <span className="ml-2 inline-block px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
              {category}
            </span>
            <span>{startDate}</span>
          </div>

          <h4 className="font-bold text-xl mt-4">{name}</h4>
        </CardHeader>

        <CardBody className="overflow-visible py-2 flex justify-center">
          <p className="text-gray-600 text-sm line-clamp-2 leading-tight">
            {description}
          </p>
        </CardBody>
      </Link>
    </Card>
  );
}
