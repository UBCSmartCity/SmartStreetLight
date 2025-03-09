"use client";

import { useEffect, useState } from "react";
import { getAddress } from "@/lib/data";

export default function Header({ data }) {
  const [location, setLocation] = useState("");
  const lastUpdated = data[data.length - 1].date.toLocaleDateString(); // fetch from db later on

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
      setLocation("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-3 flex justify-evenly items-center shadow-lg">
      <h1 className="text-xl font-semibold text-cyan-400">
        Smart Streetlight Dashboard
      </h1>
      <div className="text-sm text-gray-300 flex gap-3">
        <span id="location">📍{location} </span>
        <span>⏳ {lastUpdated}</span>
      </div>
    </nav>
  );
}
