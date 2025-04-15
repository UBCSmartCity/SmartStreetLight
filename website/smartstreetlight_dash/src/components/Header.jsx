// import { useEffect, useState } from "react";
// import { getAddress } from "@/lib/data";
import { signOut } from "next-auth/react";
import Link from "next/link";
import DropDown from "./Dropdown";

// TODO: remove location, convert to server component
export default async function Header({ lightLocation }) {
  // Show location on header
  // const [location, setLocation] = useState("");
  // const [isOn, setIsOn] = useState(false);
  // const [dropdownOpen, setDropdownOpen] = useState(false);

  // const dateObject = new Date(latestEntry.reading_time);
  // const lastUpdated = dateObject.toLocaleDateString();

  // useEffect(() => {
  //   async function showPosition(position) {
  //     const lat = position.coords.latitude;
  //     const long = position.coords.longitude;

  //     const address = await getAddress(lat, long);
  //     setLocation(address);
  //   }

  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(showPosition);
  //   } else {
  //     setLocation("N/A");
  //   }
  // }, []);

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
