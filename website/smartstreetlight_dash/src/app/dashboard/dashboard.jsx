import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DataCard from "@/components/DataCard";
import { testData } from "@/testData";
import Controls from "@/components/Controls";
// import { useState, useEffect } from "react";
import Card from "@/components/Card";
import useSWR from "swr";
// import { useSearchParams } from "next/navigation";
import Loading from "./loading";
import CardCollection from "./CardCollection";

// TODO: define swr hook elsewhere, convert this into server component

export default async function Dashboard() {
  // NOTE: comment this line and uncomment "rawData" and "error" if Raspberry Pi DB is not available
  // const { data: rawData, error, isLoading } = fetchData();

  // let rawData = testData;
  // const error = false;

  // profile name from URL, will be
  // const searchParams = useSearchParams();
  // const location = searchParams.get("location");

  // loading and data error UI

  return (
    <div className="min-h-screen flex flex-col h-full w-full text-center gap-y-4 p-3 ">
      {/* <Header lightLocation={location} /> */}

      <CardCollection />

      <DataCard energy={true} />
      <DataCard energy={false} />

      <Footer />
    </div>
  );
}
