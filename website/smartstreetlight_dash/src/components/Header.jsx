"use client";

import { useEffect, useState } from "react";
import { getAddress } from "@/lib/data";
import { Suspense } from "react";
import { signOut } from "next-auth/react";

export default function Header({ latestEntry, lightLocation }) {
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
    <nav className="p-3 flex justify-evenly items-center shadow-lg">
      <h1 className="text-xl font-semibold text-blue">
        Smart Streetlight Dashboard @ {lightLocation}
      </h1>

      <div className="text-sm text-black flex gap-6 items-center">
        <span id="location"> 📍Your Location: {location}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Toggle Switch */}
        <div
          onClick={toggleMode}
          className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
            isOn ? "bg-blue" : "bg-gray"
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
              isOn ? "translate-x-7" : "translate-x-0"
            }`}
          ></div>
        </div>
        <span className="text-sm">{isOn ? "On" : "Off"}</span>
      </div>

      <button onClick={() => signOut({ redirectTo: "/" })}>Sign Out</button>
    </nav>
  );
}
