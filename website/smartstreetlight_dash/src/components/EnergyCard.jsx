"use client";

import { ResponsiveLine } from "@nivo/line";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { testData } from "@/testData";
import { useState } from "react";
import { format } from "date-fns";
import { dayIncrements } from "@/formatting";
import { M_PLUS_1 } from "next/font/google";

export default function EnergyCard({ fetchedData }) {
  const [filter, setFilter] = useState("today");

  // current date, set to 00:00:00 for comparisons
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const d = fetchedData;
  const lastMonth = new Date(today);
  lastMonth.setDate(lastMonth.getDate() - 31);

  const ytd = new Date(new Date().getFullYear(), 0, 1);

  const oneYear = new Date(today);
  oneYear.setDate(oneYear.getDate() - 365);

  const data = d.flatMap((obj, idx) => {
    // used for date comparisons, current obj.date set to 00:00:00
    const objDateTemp = new Date(obj.date);
    objDateTemp.setHours(0, 0, 0, 0);

    switch (filter) {
      case "today":
        if (objDateTemp.getTime() == today.getTime()) {
          return {
            x: obj.date,
            y: obj.energyUsage,
          };
        } else {
          return [];
        }
      case "1M":
        if (objDateTemp >= lastMonth && objDateTemp <= today) {
          return {
            x: obj.date,
            y: obj.energyUsage,
          };
        } else {
          return [];
        }
      case "ytd":
        if (objDateTemp >= ytd && objDateTemp <= today) {
          return {
            x: obj.date,
            y: obj.energyUsage,
          };
        } else {
          return [];
        }
      case "oneYear":
        if (objDateTemp >= oneYear && objDateTemp <= today) {
          return {
            x: obj.date,
            y: obj.energyUsage,
          };
        } else {
          return [];
        }
      default:
        return {
          x: obj.date,
          y: obj.energyUsage,
        };
    }
  });

  const energyData = [
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
          fill: "#D1D5DB", // Change to desired color
        },
      },
      legend: {
        text: {
          fill: "#D1D5DB", // Change to desired color
        },
      },
    },
    tooltip: {
      container: {
        background: "#ffffff",
        color: "#333333",
        fontSize: 12,
      },
      basic: {},
      chip: {},
      table: {},
      tableCell: {},
      tableCellValue: {},
    },
  };

  function min() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);

    switch (filter) {
      case "today":
        return d;
      case "1M":
        return lastMonth;
      case "ytd":
        return ytd;
      case "oneYear":
        return oneYear;
      default:
        return "auto";
    }
  }

  function max() {
    const d = new Date();
    d.setHours(23, 59, 59, 59);

    const tdy = new Date();

    switch (filter) {
      case "today":
        return d;
      default:
        return tdy;
    }
  }

  function tickVals() {
    switch (filter) {
      case "today":
        return dayIncrements;
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
      case "today":
        return "%H:%M";
      case "max":
        return "%Y";
      default:
        return "%b-%d";
    }
  }

  return (
    <div className="flex h-2/5 bg-slate-800 text-center p-1 rounded-md shadow-sm items-center m-8">
      <section className="gap-y-2">
        <h1>Energy Usage</h1>
        <label key="today" className="w-full">
          <input
            type="radio"
            name="energyFilter"
            className="hidden peer"
            onClick={() => setFilter("today")}
          />
          <span className="w-8/12 text-center mb-2 mt-3 inline-block outline outline-1 rounded-md cursor-pointer peer-checked:bg-hoverblue hover:opacity-80 ">
            Today
          </span>
        </label>
        <label key="onemonth" className="w-full">
          <input
            type="radio"
            name="energyFilter"
            className="hidden peer"
            onClick={() => setFilter("1M")}
          />
          <span className="w-8/12 text-center mb-2 inline-block outline outline-1 rounded-md cursor-pointer peer-checked:bg-hoverblue hover:opacity-80 ">
            1 Month
          </span>
        </label>
        <label key="yeartoday" className="w-full">
          <input
            type="radio"
            name="energyFilter"
            className="hidden peer"
            onClick={() => setFilter("ytd")}
          />
          <span className="w-8/12 text-center mb-2 inline-block outline outline-1 rounded-md cursor-pointer peer-checked:bg-hoverblue hover:opacity-80 ">
            YTD
          </span>
        </label>
        <label key="oneyear" className="w-full">
          <input
            type="radio"
            name="energyFilter"
            className="hidden peer"
            onClick={() => setFilter("oneYear")}
          />
          <span className="w-8/12 text-center mb-2 inline-block outline outline-1 rounded-md cursor-pointer peer-checked:bg-hoverblue hover:opacity-80 ">
            1 Year
          </span>
        </label>
        <label key="max" className="w-full">
          <input
            type="radio"
            name="energyFilter"
            className="hidden peer"
            onClick={() => setFilter("max")}
          />
          <span className="w-8/12 text-center mb-2 inline-block outline outline-1 rounded-md cursor-pointer peer-checked:bg-hoverblue hover:opacity-80 ">
            Max
          </span>
        </label>
      </section>

      {data.length > 0 && (
        <ResponsiveLine
          data={energyData}
          margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
          xScale={{
            type: "time",
            min: min(),
            max: max(),
            precision: "hour",
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
            legend: "Energy (kWh)",
            legendOffset: -40,
            legendPosition: "middle",
            truncateTickAt: 0,
          }}
          curve={"linear"}
          colors={{ scheme: "nivo" }}
          // pointSize={10}
          // pointBorderWidth={3}
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
