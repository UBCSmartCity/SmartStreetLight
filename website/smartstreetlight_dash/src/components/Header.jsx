"use client";

import { useEffect, useState } from "react";
import { getAddress } from "@/lib/data";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Header({ latestEntry, lightLocation }) {
  const [location, setLocation] = useState("");
  const [isOn, setIsOn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dateObject = new Date(latestEntry.reading_time);
  const lastUpdated = dateObject.toLocaleDateString();

  useEffect(() => {
    async function showPosition(position) {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;

      const address = await getAddress(lat, long);
      setLocation(address);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      setLocation("N/A");
    }
  }, []);

  const toggleMode = () => setIsOn(!isOn);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="px-6 py-3 flex justify-between items-center shadow-md bg-background border-b border-border relative">
      {/* Dropdown Toggle Button */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="py-2 px-4 bg-gray text-white rounded-full text-base font-medium shadow hover:bg-gray/90 transition-all"
        >
          ☰ Menu
        </button>

        {dropdownOpen && (
          <div className="absolute mt-2 left-0 bg-boxes border border-border rounded-xl shadow-md w-64 z-10 p-4 flex flex-col gap-4 text-base">
            <div className="text-sm text-muted outline-1">
              📍 <span className="font-semibold">Your Location</span>
              <div className="mt-1 text-black">{location}</div>
            </div>

            <Link
              href="/admin"
              className="text-black hover:text-blue transition-colors px-2 py-1 rounded hover:bg-blue-50 w-full text-left"
              onClick={() => setDropdownOpen(false)}
            >
              Admin Panel
            </Link>

            <Link
              href="/profiles"
              className="text-black hover:text-blue transition-colors px-2 py-1 rounded hover:bg-blue-50 w-full text-left"
              onClick={() => setDropdownOpen(false)}
            >
              Profiles
            </Link>

            <button
              onClick={() => {
                signOut({ redirectTo: "/" });
                setDropdownOpen(false);
              }}
              className="text-red-500 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50 w-full text-left"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-blue text-center flex-1">
        Smart Streetlight Dashboard @ {lightLocation}
      </h1>

      {/* Toggle Switch */}
      <div className="flex items-center gap-2">
        <div
          onClick={toggleMode}
          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
            isOn ? "bg-blue" : "bg-gray"
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
              isOn ? "translate-x-6" : "translate-x-0"
            }`}
          ></div>
        </div>
        <span className="text-sm">{isOn ? "On" : "Off"}</span>
      </div>
    </nav>
  );
}
