'use client'

import { useState } from 'react';

export default function Controls() {
  const [isOn, setIsOn] = useState(false);

  const toggleMode = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="text-center bg-gray-700 p-3 rounded-lg shadow-lg ">
      <h2 className="text-2xl text-cyan-400 mb-4">Controls</h2>

      {/* Slider
      <div className="mb-4">
        <label htmlFor="brightness" className="text-gray-300 block mb-2">Brightness</label>
        <input
          type="range"
          id="brightness"
          min="0"
          max="100"
          className="w-full bg-gray-600 rounded-lg"
        />
      </div> */}

      {/* Toggle button */}
      <div className="mb-4">
        <label className="text-gray-300 block mb-2">Light Mode</label>
        <button
          onClick={toggleMode}
          className={`px-6 py-2 rounded-md text-white ${isOn ? 'bg-cyan-400' : 'bg-gray-500'}`}
        >
          {isOn ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  );
}
