'use client'

import { ResponsiveLine } from '@nivo/line'
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { testData } from '@/testData';
import { useState } from 'react';
import { format } from 'date-fns';


export default function EnergyCard({fetchedData}) {

  // TODO: create test data for all stats in a js file, enable filtering for graphing, style everything

  // play with line graph, understand everything 
  // set up filter for today and this week 
  // rough styling 


  // current date, set to 00:00:00 for comparisons 
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [filter, setFilter] = useState('today');

  const d = fetchedData; 


  const data = d.flatMap((obj, idx) => {

    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);


    // used for date comparisons, current obj.date set to 00:00:00
    const objDateTemp = new Date(obj.date);
    objDateTemp.setHours(0, 0, 0, 0);
   

    switch (filter) {
      case "today":

      if (objDateTemp.getTime() == today.getTime()) {
        return {
          x: obj.date,
          y: obj.energyUsage
        };
      } else {
        return []
      }

      case "7days":
        if (objDateTemp >= last7Days && objDateTemp <= today) {
          return {
            x: obj.date,
            y: obj.energyUsage
          };
        } else {
          return [];
        }
      default:
        return {
          x: obj.date,
          y: obj.energyUsage
        };
    }

  })


  const energyData = [{
    id: "energy",
    color: "hsl(309, 70%, 50%)",
    data: data
  }]





  const customTheme = {
      axis: {
          ticks: {
              text: {
                  fill: "#D1D5DB", // Change to desired color
              }
          },
          legend: {
              text: {
                  fill: "#D1D5DB", // Change to desired color
              }
          }
      }
  };
  




  return (



    <div className="flex h-2/5 bg-slate-800 text-center p-1 rounded-md shadow-sm items-center m-8">
      


      <section className='gap-y-2'>
      <h1>Energy Usage</h1>
      <label key="today" className='w-full'>
        <input type="radio" name="energyFilter" className="hidden peer" onClick={() => setFilter("today")} />
        <span className="w-8/12 text-center mb-2 mt-3 inline-block outline outline-1 rounded-md cursor-pointer peer-checked:bg-hoverblue hover:opacity-80 ">
          Today
        </span>
      </label>
      <label key="Yesterday" className='w-full'>
        <input type="radio" name="energyFilter" className="hidden peer" onClick={() => setFilter("yesterday")} />
        <span className="w-8/12 text-center mb-2 inline-block outline outline-1 rounded-md cursor-pointer peer-checked:bg-hoverblue hover:opacity-80 ">
          Yesterday
        </span>
      </label>
      <label key="sevendays" className='w-full'>
        <input type="radio" name="energyFilter" className="hidden peer" onClick={() => setFilter("sevendays")} />
        <span className="w-8/12 text-center mb-2 inline-block outline outline-1 rounded-md cursor-pointer peer-checked:bg-hoverblue hover:opacity-80 ">
          Within 7 Days
        </span>
      </label>
      </section>



      {data.length > 0 &&
        <ResponsiveLine
          data={energyData}
          margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: '0',
            max: 'auto',
            stacked: false,
            reverse: false
          }}
          theme={customTheme}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'time',
            legendOffset: 40,
            legendPosition: 'middle',
            format: function (date) {
              const hours = format(date, 'HH:mm');
              // const day = format(date, 'yyyy-MM-dd');

              return hours;
            }
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Energy (kWh)',
            legendOffset: -40,
            legendPosition: 'middle',
            truncateTickAt: 0
          }}
          curve={'linear'}
          colors={{ scheme: 'nivo' }}
          pointSize={10}
          pointBorderWidth={3}
          pointBorderColor={{ from: 'serieColor' }}
          pointColor={{ theme: 'background' }}
          pointLabelYOffset={-12}
          enableTouchCrosshair={true}
          useMesh={true}

        />}


    </div>



  );
}