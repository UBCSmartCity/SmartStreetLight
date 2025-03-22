"use client";

import useSWR from "swr";
import { fetchData } from "../page";

// for testing purposes
export default function Profile() {
  const { data, error } = fetchData();

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  console.log(new Date(data[0].date));

  return (
    <div>
      <h1>{data[0].id}</h1>
      {/* <p>{data}</p> */}
    </div>
  );
}
