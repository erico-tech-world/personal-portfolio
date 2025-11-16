




import MainLayout from "@/components/shared/MainLayout";

// FIX: Use a type-only import for `Metadata` as it is a type, not a value, which resolves the module error.
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ike Chidalu Promise | Personal Portfolio",
  description: "A modern, animated personal portfolio to showcase projects, services, and skills, built with Next.js, Supabase, and Cloudinary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-navy-dark text-white overflow-x-hidden`}>
        <Navbar />
        <MainLayout>{children}</MainLayout>
        <Footer />
      </body>
    </html>
  );
}