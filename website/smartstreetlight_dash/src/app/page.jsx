"use client";

import Link from "next/link";

export default function Homepage() {
  return (
    <div className="min-h-screen  flex flex-col justify-center items-center p-8">
      <h1 className="text-6xl font-bold text-center tracking-wide mb-8">
        Smart Streetlight
      </h1>

      <Link href="/login">
        <div className="p-2"></div>
        Login
      </Link>
    </div>
  );
}
