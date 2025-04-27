"use client";

import { useState, useEffect } from "react";
import { addDataIncrementally } from "@/lib/data";

// TODO: find a better way to continuously add data?
export default function Page() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    addDataIncrementally();

    setTimeout(() => {
      setCount((i) => i + 1);
    }, 3000);
  }, [count]);

  return <></>;
}
