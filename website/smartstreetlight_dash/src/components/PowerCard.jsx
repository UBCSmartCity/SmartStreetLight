'use client'

import { ResponsiveLine } from '@nivo/line'

import { useState } from 'react';
import { format } from 'date-fns';


export default function EnergyCard({fetchedData}) {


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
          y: obj.powerConsumption
        };
      } else {
        return []
      }

      case "7days":
        if (objDateTemp >= last7Days && objDateTemp <= today) {
          return {
            x: obj.date,
            y: obj.powerConsumption
          };
        } else {
          return [];
        }
      default:
        return {
          x: obj.date,
          y: obj.powerConsumption
        };
    }

  })


  const powerData = [{
    id: "energy",
    color: "hsl(309, 70%, 50%)",
    data: data
  }]









  return (



    <div className="h-1/2 bg-slate-500 text-center p-10 rounded-md shadow-sm">
      <h1>Power Consumption</h1>


<section className='flex '>
      <label key="today" className='w-full'>
        <input type="radio" name="energyFilter" className="hidden peer" onClick={() => setFilter("today")} />
        <span className="w-8/12 text-center mb-2 inline-block outline outline-1 rounded-md cursor-pointer peer-checked:bg-hoverblue hover:opacity-80 ">
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
          data={powerData}
          margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: '0',
            max: 'auto',
            stacked: false,
            reverse: false
          }}
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
            legend: 'Power (W)',
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