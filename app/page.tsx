import Link from "next/link";
import CategoryCircles from "@/components/events/CategoryCircles";
import HeroBanner from "@/components/home/HeroBanner";
import DiscoverBlocks from "@/components/home/DiscoverBlocks";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen w-full px-4 py-12 md:py-16">
      <div className="max-w-6xl w-full mx-auto">
        <HeroBanner/>
        <div className="flex flex-col items-center text-center mb-16">
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/events"
              className="px-6 py-3 bg-accent-3 hover:bg-accent-3-hover text-white rounded-full font-medium transition-colors flex items-center justify-center gap-2"
            >
              Browse Events
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
        
        <div className="mb-16">
          <CategoryCircles />
        </div>
        
        <DiscoverBlocks/>
      </div>
    </main>
  );
}