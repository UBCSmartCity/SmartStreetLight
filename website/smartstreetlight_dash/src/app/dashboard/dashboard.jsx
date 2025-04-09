"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DataCard from "@/components/DataCard";
import { testData } from "@/testData";
import Controls from "@/components/Controls";
import { useState, useEffect } from "react";
import Card from "@/components/Card";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import Loading from "./loading";

// constant fetch with useSWR
export function fetchData() {
  const searchParams = useSearchParams();
  const location = searchParams.get("location");
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const endpoint = location === "bigway" ? "bigway" : "sensor";
  const port = location === "bigway" ? "5001" : "5000";

  console.log(endpoint);
  const { data, error, isLoading } = useSWR(
    `http://10.17.168.46:${port}/api/${endpoint}_readings`,
    fetcher,
    {
      refreshInterval: 100,
    }
  );

  return { data, error, isLoading };
}

export default function Dashboard() {
  // NOTE: comment this line and uncomment "rawData" and "error" if Raspberry Pi DB is not available
  // const { data: rawData, error, isLoading } = fetchData();

  let rawData = testData;
  const error = false;
  const [refresh, setRefresh] = useState(0);

  // profile name from URL, will be
  const searchParams = useSearchParams();
  const location = searchParams.get("location");

  // loading and data error UI
  if (error) rawData = []; // TODO: set data to
  if (!rawData) return <Loading />;

  // latest entry
  const latestEntry = rawData[rawData.length - 1] || {
    reading_time: new Date("2024-03-20T03:20:10"),
    energy_usage: "n/a",
    light_status: "n/a",
    brightness_level: "n/a",
    power_consumption: "n/a",
    battery_status: "n/a",
    sensor_health: "n/a",
    location: "n/a",
  };

  return (
    <div className="min-h-screen flex flex-col h-full w-full text-center gap-y-4 p-3 ">
      <Header latestEntry={latestEntry} lightLocation={location} />

      <section className="grid grid-cols-5 place-items-center">
        <Card type={"Last Updated"} value={`${latestEntry.reading_time}`} />
        <Card type={"Brightness"} value={`${latestEntry.brightness_level}%`} />
        <Card
          type={"Battery"}
          value={`${latestEntry.battery_status || "n/a"}%`}
        />
        <Card type={"Sensor Health"} value={`${latestEntry.sensor_health}`} />
        <Card type={"Light Status"} value={`${latestEntry.light_status}`} />
      </section>

      <DataCard energy={true} />
      <DataCard energy={false} />

      <Footer />
    </div>
  );
}

// TODO: check auth pages, don't fix middleware
// skeleton for error page
// logs
