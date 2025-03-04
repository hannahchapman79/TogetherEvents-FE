import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { Suspense } from "react";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Together Events",
  description:
    "Discover, sign up, and manage events effortlessly. Stay connected with your community and sync events to your Google Calendar with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
      <AuthProvider>
        <Navbar />
        <main className="flex-1 pt-16">
          <Suspense fallback={<Loading />} />
          {children}
        </main>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
