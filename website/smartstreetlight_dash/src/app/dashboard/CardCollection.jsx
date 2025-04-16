"use client";

import { testData } from "@/testData";
import Card from "@/components/Card";

// contains all Card components
export default function CardCollection() {
  // NOTE: comment this line and uncomment "rawData" and "error" if Raspberry Pi DB is not available
  // const { data: rawData, error, isLoading } = fetchData();

  let rawData = testData;
  const error = false;

  if (error) rawData = [];

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
  );
}
