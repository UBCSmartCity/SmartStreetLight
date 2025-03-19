"use client";

import { ResponsiveLine } from "@nivo/line";
import { useState } from "react";
import { fetchData } from "@/app/page";
import { testData } from "@/testData";

// Card for energy and power graphs
export default function DataCard({ energy }) {
  const { data: rawData, error, isLoading } = fetchData();
  const [filter, setFilter] = useState("tdy");

  console.log(rawData);

  // current date, set to 00:00:00 for comparisons
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // one month ago
  const lastMonth = new Date(startOfToday);
  lastMonth.setDate(lastMonth.getDate() - 31);

  // jan to now
  const ytd = new Date(new Date().getFullYear(), 0, 1);

  // 365 days ago
  const oneYear = new Date(startOfToday);
  oneYear.setDate(oneYear.getDate() - 365);

  if (error) return <div>Failed to load</div>;
  if (!rawData) return <div>Loading...</div>;

  const data = rawData.flatMap((obj, idx) => {
    // used for date comparisons, current obj.date set to 00:00:00
    const objDateTemp = new Date(obj.reading_time);
    objDateTemp.setHours(0, 0, 0, 0);

    const yData = energy ? obj.energy_usage : obj.power_consumption;

    switch (filter) {
      case "tdy":
        if (objDateTemp.getTime() == startOfToday.getTime()) {
          return {
            x: new Date(obj.reading_time), // converts UTC to locale time
            y: yData,
          };
        }
        return [];
      case "1M":
        if (objDateTemp >= lastMonth && objDateTemp <= startOfToday) {
          return {
            x: new Date(obj.reading_time),
            y: yData,
          };
        }
        return [];
      case "ytd":
        if (objDateTemp >= ytd && objDateTemp <= startOfToday) {
          return {
            x: new Date(obj.reading_time),
            y: yData,
          };
        }
        return [];

      case "1Y":
        if (objDateTemp >= oneYear && objDateTemp <= startOfToday) {
          return {
            x: new Date(obj.reading_time),
            y: yData,
          };
        }
        return [];

      default:
        return {
          x: new Date(obj.reading_time),
          y: yData,
        };
    }
  });

  const graphData = [
    {
      id: "energy",
      color: "hsl(309, 70%, 50%)",
      data: data,
    },
  ];

  const customTheme = {
    axis: {
      ticks: {
        text: {
          fill: "#D1D5DB",
        },
      },
      legend: {
        text: {
          fill: "#D1D5DB",
        },
      },
    },
    tooltip: {
      container: {
        background: "#ffffff",
        color: "#333333",
      },
    },
    crosshair: {
      line: {
        stroke: "white",
        strokeWidth: 1,
        strokeOpacity: 0.35,
      },
    },
  };

  function min() {
    switch (filter) {
      case "tdy":
        return startOfToday;
      case "1M":
        return lastMonth;
      case "ytd":
        return ytd;
      case "1Y":
        return oneYear;
      default:
        return "auto";
    }
  }

  function max() {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 59);

    const todayCurrentTime = new Date();

    switch (filter) {
      case "tdy":
        return endOfToday;
      default:
        return todayCurrentTime;
    }
  }

  function tickVals() {
    switch (filter) {
      case "tdy":
        return "every 4 hours";
      case "1M":
        return "every 3 days";
      case "max":
        return "every year";
      default:
        return "every month";
    }
  }

  function format() {
    switch (filter) {
      case "tdy":
        return "%H:%M";
      case "1M":
        return "%b-%d";
      case "max":
        return "%Y";

      default:
        return "%Y-%b";
    }
  }

  console.log("rerender from", energy ? "energy" : "power", graphData); // for detecting rerenders

  const filterDetails = {
    Today: "tdy",
  };

  return (
    <div className="flex h-2/5 bg-slate-800 text-center p-1 rounded-md shadow-sm items-center m-8">
      <section className="gap-y-2">
        <h1>{energy ? "Energy" : "Power"} Usage</h1>
        <label key="tdy" className="w-full">
          <input
            type="radio"
            name={`${energy}filter`}
            className="hidden peer  focus:bg-red-600"
            onClick={() => setFilter("tdy")}
          />
          <span className="w-8/12 text-center mb-2 mt-3 inline-block outline outline-1 rounded-md cursor-pointer peer-checked:bg-cyan-400 hover:opacity-80 ">
            Today
          </span>
        </label>
        <label key="1M" className="w-full">
          <input
            type="radio"
            name={`${energy}filter`}
            className="hidden peer"
            onClick={() => setFilter("1M")}
          />
          <span className="w-8/12 text-center mb-2 inline-block outline outline-1 rounded-md cursor-pointer peer-checked:bg-cyan-400 hover:opacity-80 ">
            1 Month
          </span>
        </label>
        <label key="ytd" className="w-full">
          <input
            type="radio"
            name={`${energy}filter`}
            className="hidden peer"
            onClick={() => setFilter("ytd")}
          />
          <span className="w-8/12 text-center mb-2 inline-block outline outline-1 rounded-md cursor-pointer peer-checked:bg-cyan-400 hover:opacity-80 ">
            YTD
          </span>
        </label>
        <label key="1Y" className="w-full">
          <input
            type="radio"
            name={`${energy}filter`}
            className="hidden peer"
            onClick={() => setFilter("1Y")}
          />
          <span className="w-8/12 text-center mb-2 inline-block outline outline-1 rounded-md cursor-pointer peer-checked:bg-cyan-400 hover:opacity-80 ">
            1 Year
          </span>
        </label>
        <label key="max" className="w-full">
          <input
            type="radio"
            name={`${energy}filter`}
            className="hidden peer"
            onClick={() => setFilter("max")}
          />
          <span className="w-8/12 text-center mb-2 inline-block outline outline-1 rounded-md cursor-pointer peer-checked:bg-cyan-400 hover:opacity-80 ">
            Max
          </span>
        </label>
      </section>

      {data.length > 0 && (
        <ResponsiveLine
          data={graphData}
          margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
          xScale={{
            type: "time",
            min: min(),
            max: max(),
            precision: "hour",
            useUTC: false,
          }}
          axisBottom={{
            orient: "bottom",
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
            tickValues: tickVals(),
            format: format(),
            legendOffset: 100,
            translateX: 25,
            legendPosition: "start",
            legend: "hi",
          }}
          yScale={{
            type: "linear",
            min: "0",
            max: "auto",
            stacked: false,
            reverse: false,
          }}
          theme={customTheme}
          axisTop={null}
          axisRight={null}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: energy ? "Energy (kWh)" : "Power (W)",
            legendOffset: -40,
            legendPosition: "middle",
            truncateTickAt: 0,
          }}
          enableGridX={false}
          crosshairType="x"
          curve={"linear"}
          colors={{ scheme: "nivo" }}
          pointBorderColor={{ from: "serieColor" }}
          pointColor={{ theme: "background" }}
          pointLabelYOffset={-12}
          enableTouchCrosshair={true}
          useMesh={true}
        />
      )}
    </div>
  );
}
