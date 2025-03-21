"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DataCard from "@/components/DataCard";
import { testData } from "@/testData";
import Controls from "@/components/Controls";
import { useState, useEffect } from "react";
import Card from "@/components/Card";
import useSWR from "swr";

// constant fetch with useSWR
export function fetchData() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "http://10.0.0.174:5000/api/sensor_readings",
    fetcher,
    {
      refreshInterval: 100,
    }
  );

  return { data, error, isLoading };
}

// TODO: swr fetches every second, but rerenders only happen when data changes - confirm understanding of this
export default function Home() {
  // const { data: rawData, error, isLoading } = fetchData();
  const rawData = testData;
  const error = false;
  const [refresh, setRefresh] = useState(0);
  console.log(rawData);

  if (error) return <div>Failed to load</div>;
  if (!rawData) return <div>Loading...</div>;
  const latestEntry = rawData[rawData.length - 1];

  return (
    <div className="flex flex-col justify-center h-screen w-screen text-center">
      <Header latestEntry={latestEntry} />

      <section className="grid grid-cols-4 gap-4 h-1/6 justify-center">
        <Card type={"Brightness"} value={`${latestEntry.brightness_level}%`} />
        <Card type={"Battery"} value={`${latestEntry.battery_status}%`} />
        <Card type={"Sensor Health"} value={`${latestEntry.sensor_health}`} />
        <Card type={"Light Status"} value={`${latestEntry.light_status}`} />
      </section>

      <main className="flex h-screen">
        {/* <div className="flex flex-col items-center m-5">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"> */}
        {/* <Controls />
            <p className="text-cyan-400 mt-4">Brightness Level</p>
            <p className="text-gray-300">{`${latestEntry.brightness_level}%`}</p>

            <p className="text-cyan-400 mt-4">Battery Status</p>
            <p className="text-gray-300">{`${latestEntry.battery_status}%`}</p>

            <p className="text-cyan-400 mt-4">Sensor Health</p>
            <p className="text-gray-300">{latestEntry.sensor_health}</p>
            <p className="text-cyan-400 mt-4">Streetlight Location</p>
            <p className="text-gray-300">{latestEntry.location}</p> */}
        {/* </div>
        </div> */}

        <div className="  w-full">
          <DataCard energy={true} />
          <DataCard energy={false} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
