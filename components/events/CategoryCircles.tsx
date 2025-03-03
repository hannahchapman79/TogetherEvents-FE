import Link from "next/link";
import { TiTree } from "react-icons/ti";
import {
  LuPalette,
  LuBookOpenText,
  LuPartyPopper,
  LuUsersRound,
} from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { IoSchoolOutline } from "react-icons/io5";

export default function CategoryCircles() {
  const categories = [
    { name: "Arts", slug: "arts", icon: <LuPalette size={28} /> },
    { name: "Book Club", slug: "book", icon: <LuBookOpenText size={28} /> },
    {
      name: "Networking",
      slug: "networking",
      icon: <LuUsersRound size={28} />,
    },
    {
      name: "Entertainment",
      slug: "entertainment",
      icon: <LuPartyPopper size={28} />,
    },
    { name: "Health", slug: "health", icon: <FaRegHeart size={28} /> },
    { name: "Outdoors", slug: "outdoors", icon: <TiTree size={28} /> },
    {
      name: "Education",
      slug: "education",
      icon: <IoSchoolOutline size={28} />,
    },
  ];

  return (
    <div className="w-full p-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 place-items-center">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/events?category=${category.slug}`}
            className="flex flex-col items-center justify-center 
                                  w-full w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 
                                   rounded-full bg-white 
                                   text-sm sm:text-xs md:text-lg font-medium 
                                   shadow-md hover:shadow-lg border border-gray-200 
                                   transition-all hover:bg-blue-50 hover:border-blue-300 hover:scale-105"
          >
            <span className="text-primary mb-2">{category.icon}</span>
            <span className="text-gray-800 text-sm text-center sm:text-xs">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
