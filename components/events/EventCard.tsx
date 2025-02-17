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
  const eventImage =
    image || categoryImages[category || ""] || "/images/default.jpg";

  return (
    <Card className="py-4">
      <Link className="w-full h-full" href={`/events/${id}`}>
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">{category}</p>
          <p className="text-default-500">{startDate}</p>
          <h4 className="font-bold text-large">{name}</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src={eventImage}
            width={270}
          />
        </CardBody>
      </Link>
    </Card>
  );
}
