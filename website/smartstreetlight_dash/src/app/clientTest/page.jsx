"use client";

import { useState, useEffect } from "react";
import { addDataIncrementally } from "@/lib/data";

// route to add streetlight data periodically for testing purposes
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
