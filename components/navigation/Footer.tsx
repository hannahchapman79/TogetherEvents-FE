import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white text-[#735751] py-6 mt-10">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 mb-4 md:mb-0">
          <Image src="/fullsize-logo.png" alt="Logo" width={200} height={100} />
        </Link>
        <ul className="flex space-x-6 text-lg">
          <li>
            <Link href="/" className="hover:text-[#bf4342]">
              Home
            </Link>
          </li>
          <li>
            <Link href="/events" className="hover:text-[#bf4342]">
              Events
            </Link>
          </li>
          <li>
            <Link href="/login" className="hover:text-[#bf4342]">
              Login
            </Link>
          </li>
          <li>
            <Link href="/signup" className="hover:text-[#bf4342]">
              Sign up
            </Link>
          </li>
        </ul>
      </div>
      <div className="text-center text-sm text-[#4a4a4a] mt-4">
        © 2025 Together Events
      </div>
    </footer>
  );
}
