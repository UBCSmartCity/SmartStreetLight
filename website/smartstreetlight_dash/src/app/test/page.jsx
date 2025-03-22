"use client";

import useSWR from "swr";
import { fetchData } from "../page";

// for testing purposes
export default function Profile() {
  const temp = fetch("http://192.168.246.8/").then((r) => console.log(r));

  // if (error) return <div>Failed to load</div>;
  // if (!data) return <div>Loading...</div>;

  // console.log(data);

  return (
    <div>
      {/* <h1>{data[0].id}</h1> */}
      {/* <p>{data}</p> */}
    </div>
  );
}
