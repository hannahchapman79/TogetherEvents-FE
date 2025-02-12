import type { Metadata } from "next";
import { AuthProvider } from '@/context/AuthContext'
import { Inter } from 'next/font/google'
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Together Events",
  description: "Discover, sign up, and manage events effortlessly. Stay connected with your community and sync events to your Google Calendar with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
