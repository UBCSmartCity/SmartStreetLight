"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import DropDown from "./Dropdown";

// TODO: remove location, convert to server component
export default function Header({ lightLocation }) {
  return (
    <nav className="px-6 py-3 flex justify-between items-center shadow-md bg-background border-b border-border relative">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-blue text-center flex-1">
        Smart Streetlight Dashboard @ {lightLocation}
      </h1>

      <DropDown></DropDown>
    </nav>
  );
}
