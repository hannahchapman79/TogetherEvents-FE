"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";

export default function Navbar() {
  const { user } = useAuth();

  const closeNavbar = () => {
    const navbarToggler = document.querySelector(
      ".navbar-toggler",
    ) as HTMLElement | null;
    if (!navbarToggler) return;

    const isExpanded = navbarToggler.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      navbarToggler.click();
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          onClick={closeNavbar}
          href="/"
          className="flex items-center space-x-3"
        >
          <Image src="/fullsize-logo.png" alt="Logo" width={260} height={140} />
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="navbar-toggler md:hidden inline-flex items-center p-2 w-10 h-10 justify-center text-[#735751] rounded-lg hover:text-[#e7d7c1] focus:outline-none focus:ring-2 focus:ring-[#bf4342]"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 17 14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke="#735751"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } w-full md:block md:w-auto transition-all duration-200 ease-in-out`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:items-center">
            <li className="mb-4 md:mb-0">
              <Link
                onClick={closeNavbar}
                href="/"
                className={`block py-2 px-3 rounded md:p-0 text-lg md:text-xl ${
                  isActive("/")
                    ? "text-[#9e2a2b] font-semibold"
                    : "text-[#735751] hover:text-[#bf4342]"
                }`}
              >
                Home
              </Link>
            </li>
            <li className="mb-4 md:mb-0">
              <Link
                onClick={closeNavbar}
                href="/events"
                className={`block py-2 px-3 rounded md:p-0 text-lg md:text-xl ${
                  isActive("/events")
                    ? "text-[#9e2a2b] font-semibold"
                    : "text-[#735751] hover:text-[#bf4342]"
                }`}
              >
                Events
              </Link>
            </li>

            {user ? (
              <li className="mb-4 md:mb-0 flex items-center">
                <Avatar />
              </li>
            ) : (
              <>
                <li className="mb-4 md:mb-0">
                  <Link
                    onClick={closeNavbar}
                    href="/login"
                    className={`block py-2 px-3 rounded md:p-0 text-lg md:text-xl ${
                      isActive("/login")
                        ? "text-[#9e2a2b] font-semibold"
                        : "text-[#735751] hover:text-[#bf4342]"
                    }`}
                  >
                    Login
                  </Link>
                </li>
                <li className="mb-4 md:mb-0">
                  <Link
                    onClick={closeNavbar}
                    href="/signup"
                    className={`block py-2 px-3 rounded md:p-0 text-lg md:text-xl ${
                      isActive("/signup")
                        ? "text-[#9e2a2b] font-semibold"
                        : "text-[#735751] hover:text-[#bf4342]"
                    }`}
                  >
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
