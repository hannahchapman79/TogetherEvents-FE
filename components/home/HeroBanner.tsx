import Image from "next/image";

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-xl">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-events.jpg" 
          alt="Ocean"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
      </div>

      <div className="relative z-20 h-full w-full flex flex-col items-start justify-center p-8 md:p-12 lg:p-16 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-2xl">
          Find Your Next Unforgettable Experience
        </h1>
        
        <p className="mt-4 text-lg md:text-xl text-white/90 max-w-xl">
          Discover local events, connect with like-minded people, and create memories that last a lifetime.
        </p>
      </div>
    </div>
  );
}