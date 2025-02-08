'use client'

import { useEffect, useState } from "react";

export default function Header({data}) {

    const [location, setLocation] = useState();
    let lastUpdated = data[data.length -1].date.toLocaleDateString(); // fetch from db later on


    // TODO: find another alternative that is faster
    useEffect(() => {
   
        async function showPosition(position) {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            const t = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}&zoom=18`)
            const loc = await t.json() 
            
            setLocation(loc.address.building || loc.display_name.split(', ')[0] +  " " + loc.display_name.split(', ')[1] || "Location not detected" );
           
          }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
          } else {
            setLocation("Geolocation is not supported by this browser.");
          }

       


    }, [])
       
   
      
     


    return (
        <nav className="bg-gray-800 text-white p-3 flex justify-evenly items-center shadow-lg">
            <h1 className="text-xl font-semibold text-cyan-400">Smart Streetlight Dashboard</h1>
            <div className="text-sm text-gray-300 flex gap-3">
                <span id="location">📍{location} </span>
                <span>⏳ {lastUpdated}</span>
            </div>
        </nav>
    );
}
