"use client";

import dynamic from "next/dynamic";

// page for experimenting with CanvasJS before migrating, previously using NivoJS
export default function Page() {
  // import chart without ssr for canvas graph
  let CanvasJSChart = dynamic(
    () =>
      import("@canvasjs/react-charts").then((mod) => mod.default.CanvasJSChart),
    { ssr: false }
  );

  const options = {
    theme: "light1", // "light2", "dark1", "dark2"
    animationEnabled: true,
    title: {
      text: "Basic Column Chart in Next.js",
    },
    data: [
      {
        type: "line",
        dataPoints: [
          { label: "apple", y: 10 },
          { label: "orange", y: 15 },
          { label: "banana", y: 25 },
          { label: "mango", y: 30 },
          { label: "grape", y: 28 },
        ],
      },
    ],
  };
  const containerProps = {
    width: "80%",
    height: "360px",
    margin: "auto",
  };

  return (
    <div>
      <div>
        <CanvasJSChart options={options} containerProps={containerProps} />
      </div>
    </div>
  );
}
