"use client";

import { BarLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <BarLoader width="500" />
    </div>
  );
}
