"use client";

import Link from "next/link";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white p-8">
      <h1 className="text-6xl font-bold text-center tracking-wide mb-8">
        Smart Streetlight
      </h1>

      <Link href="/login">Login</Link>
    </div>
  );
}
