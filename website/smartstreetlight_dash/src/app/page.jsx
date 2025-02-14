"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DataCard from "@/components/DataCard";
import Card from "@/components/Card";
import { testData } from "@/testData";
import Controls from "@/components/Controls";
import PowerCard from "@/components/PowerCard";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(testData); // fetch from db

  // TODO: remove overflow causing scroll bars
  // TODO: merge energy and power into one component

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //         setData(prevData => {
  //             let lastEntry = prevData[prevData.length - 1];
  //             let newDate = new Date(lastEntry.date.getTime() + 60 * 60 * 1000); // Increment by 1 hour

  //             const newData = {
  //                 date: newDate,
  //                 energyUsage: Math.floor(Math.random() * 400),
  //                 lightStatus: Math.random() > 0.5 ? 'ON' : 'OFF',
  //                 brightnessLevel: Math.floor(Math.random() * 100),
  //                 powerConsumption: Math.floor(Math.random() * 120),
  //                 batteryStatus: ['Charging', 'Discharging', 'Fully Charged'][Math.floor(Math.random() * 3)],
  //                 sensorHealth: ['Good', 'Warning', 'Critical'][Math.floor(Math.random() * 3)]
  //             };

  //             console.log('New mock data added:', newData);
  //             return [...prevData, newData];
  //         });
  //     }, 5000); // Runs every 5 seconds

  //     return () => clearInterval(interval); // Cleanup on unmount
  // }, []); // Runs only once on mount

  return (
    <div className="h-screen w-screen text-center">
      <Header data={data}></Header>

      <main className="flex h-screen">
        <div className="flex flex-col items-center m-5">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <Controls />

            <p className="text-cyan-400 mt-4">Brightness Level</p>
            <p className="text-gray-300">{`${testData[0].brightnessLevel}%`}</p>

            <p className="text-cyan-400 mt-4">Battery Status</p>
            <p className="text-gray-300">{`${testData[0].batteryStatus}%`}</p>

            <p className="text-cyan-400 mt-4">Sensor Health</p>
            <p className="text-gray-300">{testData[0].sensorHealth}</p>
            <p className="text-cyan-400 mt-4">Streetlight Location</p>
            <p className="text-gray-300">{testData[0].location}</p>
          </div>
        </div>

        <div className="flex-grow h-full w-fit">
          <DataCard fetchedData={data} energy={true}></DataCard>
          <DataCard fetchedData={data} energy={false}></DataCard>
        </div>
      </main>

      <Footer></Footer>
    </div>
  );
}
