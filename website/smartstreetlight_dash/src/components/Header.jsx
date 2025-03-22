"use client";

import { useEffect, useState } from "react";
import { getAddress } from "@/lib/data";
import { Suspense } from "react";
export default function Header({ latestEntry }) {
  const [location, setLocation] = useState("");
  const [isOn, setIsOn] = useState(false);

  console.log(latestEntry);
  // convert to date object, then to local date string
  const dateObject = new Date(latestEntry.reading_time);
  const lastUpdated = dateObject.toLocaleDateString();

  // requests location from google, sets location
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

  const toggleMode = () => {
    setIsOn(!isOn);
  };

  return (
    <nav className="bg-gray-800 text-white p-3 flex justify-evenly items-center shadow-lg">
      <h1 className="text-xl font-semibold text-cyan-400">
        Smart Streetlight Dashboard @ {latestEntry.location}
      </h1>

      <div className="text-sm text-gray-300 flex gap-6 items-center">
        <span id="location"> 📍Your Location: {location}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleMode}
          className={`px-4 py-1 rounded-md text-white text-sm ${
            isOn ? "bg-cyan-400" : "bg-gray-500"
          }`}
        >
          {isOn ? "On" : "Off"}
        </button>
      </div>
    </nav>
  );
}
