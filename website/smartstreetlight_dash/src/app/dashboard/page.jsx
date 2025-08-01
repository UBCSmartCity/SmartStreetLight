"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DataCard from "@/components/DataCard";
import CardCollection from "./CardCollection";
import { FetchData } from "@/lib/clientData";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const loc = searchParams.get("location") || "";
  const id = searchParams.get("id") || "";

  const [refreshInterval, setRefreshInterval] = useState(5000);

  const { data: rawData, error, isLoading } = FetchData(id, refreshInterval);

  console.log("refreshInterval:", refreshInterval);
  console.log("rawData:", rawData);

  return (
    <div className="min-h-screen flex flex-col h-full w-full text-center gap-y-4 p-3 ">
      <Header lightLocation={loc} />

      {/*  Refresh Interval Dropdown */}
      <div className="flex justify-center items-center gap-2 mb-2">
        <label htmlFor="refresh-interval" className="font-medium">
          Refresh Interval:
        </label>
        <select
          id="refresh-interval"
          value={refreshInterval}
          onChange={(e) => setRefreshInterval(Number(e.target.value))}
          className="border rounded px-2 py-1 bg-white text-black"
        >
          <option value={5000}>5 seconds</option>
          <option value={15000}>15 seconds</option>
          <option value={30000}>30 seconds</option>
          <option value={60000}>1 minute</option>
        </select>
      </div>

      <CardCollection rawData={rawData} error={error} isLoading={isLoading} />

      <DataCard
        energy={true}
        rawData={rawData}
        error={error}
        isLoading={isLoading}
      />
      <DataCard
        energy={false}
        rawData={rawData}
        error={error}
        isLoading={isLoading}
      />

      <Footer />
    </div>
  );
}
