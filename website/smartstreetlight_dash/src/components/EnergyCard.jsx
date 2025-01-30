'use client'

import { ResponsiveLine } from '@nivo/line'
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { testData } from '@/testData';
import { useState } from 'react';
import { format } from 'date-fns';


export default function EnergyCard() {

  // TODO: create test data for all stats in a js file, enable filtering for graphing, style everything

    const [filter, setFilter] = useState('today'); 

    console.log(testData)

    const data = testData.map((obj, idx) => {
      return {
        x: obj.date,
        y: obj.energyUsage
      }
    })

    const energyData = [{
      id: "energy",
      color: "hsl(309, 70%, 50%)",
      data: data 
    }]

    console.log(energyData)

   


    return (



      <div className="h-1/2 w-1/2 bg-slate-400">
        <h1>Energy Usage</h1>

       

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


          <ResponsiveLine
            data={energyData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: '0',
              max: 'auto',
              stacked: true,
              reverse: false
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'time',
              legendOffset: 36,
              legendPosition: 'middle',
              truncateTickAt: 0,
              format: function (date) {
                const hours = format(date, 'HH:mm');
                const day = format(date, 'yyyy-MM-dd');

                return hours === '00:00' ? `${day} ${hours}` : hours;
              }
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Usage (kWh)',
              legendOffset: -40,
              legendPosition: 'middle',
              truncateTickAt: 0
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="data.yFormatted"
            pointLabelYOffset={-12}
            enableTouchCrosshair={true}
            useMesh={true}

          />
        </div>




   
    );
  }