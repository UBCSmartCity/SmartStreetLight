"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DataCard from "@/components/DataCard";
import { testData } from "@/testData";
import Controls from "@/components/Controls";
import { useState, useEffect } from "react";

import useSWR from "swr";

// constant fetch with useSWR
export function fetchData() {
  const fetcher = (...args) =>
    fetch(...args)
      .then((res) => res.json())
      .then((res) => res.data);

  const { data, error, isLoading } = useSWR("/data", fetcher, {
    refreshInterval: 1000,
  });

  return { data, error, isLoading };
}

export default function Home() {
  const [rawData, setRawData] = useState([
    {
      date: new Date("2024-02-29T03:20:10"),
      energyUsage: 0,
      lightStatus: "Off",
      brightnessLevel: 0,
      powerConsumption: 0,
      batteryStatus: 0,
      sensorHealth: "Warning",
      location: "Langara 49th Station",
    },
  ]);
  const [refresh, setRefresh] = useState(0);

  // incremental fetching with useEffect
  // useEffect(() => {
  //   async function gettingData() {
  //     const result = await getData();
  //     console.log("fetching data", result);
  //     // setRawData((prevData) => result);
  //   }

  //   gettingData();

  //   setTimeout(() => {
  //     setRefresh(Math.random());
  //   }, 5000);
  // }, [refresh]);

  // const rawData = testData;

  return (
    <div className="h-screen w-screen text-center">
      <Header data={rawData} />

      <main className="flex h-screen">
        <div className="flex flex-col items-center m-5">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <Controls />
            <p className="text-cyan-400 mt-4">Brightness Level</p>
            <p className="text-gray-300">{`${rawData[0].brightnessLevel}%`}</p>

            <p className="text-cyan-400 mt-4">Battery Status</p>
            <p className="text-gray-300">{`${rawData[0].batteryStatus}%`}</p>

            <p className="text-cyan-400 mt-4">Sensor Health</p>
            <p className="text-gray-300">{rawData[0].sensorHealth}</p>
            <p className="text-cyan-400 mt-4">Streetlight Location</p>
            <p className="text-gray-300">{rawData[0].location}</p>
          </div>
        </div>

        <div className="flex-grow h-full w-fit">
          {/* <DataCard rawData={rawData} energy={true} /> */}
          <DataCard energy={false} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
