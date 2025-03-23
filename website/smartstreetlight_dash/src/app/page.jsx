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
    "http://192.168.246.46:5000/api/sensor_readings",
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
    <div className="min-h-screen flex flex-col h-full w-full text-center gap-y-4 p-3">
      <Header latestEntry={latestEntry} />

      <section className="grid grid-cols-5 place-items-center">
        <Card type={"Last Updated"} value={`${latestEntry.reading_time}`} />
        <Card type={"Brightness"} value={`${latestEntry.brightness_level}%`} />
        <Card type={"Battery"} value={`${latestEntry.battery_status}%`} />
        <Card type={"Sensor Health"} value={`${latestEntry.sensor_health}`} />
        <Card type={"Light Status"} value={`${latestEntry.light_status}`} />
      </section>

      <DataCard energy={true} />
      <DataCard energy={false} />

      <Footer />
    </div>
  );
}
