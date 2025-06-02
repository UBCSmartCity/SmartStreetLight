"use client";

import { useState } from "react";

// TODO: convert to server component, calls a server action once firmware is hooked up to backend
export default function Controls() {
  const [isOn, setIsOn] = useState(false);

  const toggleMode = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="text-center p-3 rounded-lg shadow-lg ">
      <h2 className="text-2xl text-cyan-400 mb-4">Controls</h2>

      <div className="mb-4">
        <label className="text-gray-300 block mb-2">Light Mode</label>
        <button
          onClick={toggleMode}
          className={`px-6 py-2 rounded-md text-white ${
            isOn ? "bg-cyan-400" : "bg-gray-500"
          }`}
        >
          {isOn ? "On" : "Off"}
        </button>
      </div>
    </div>
  );
}
