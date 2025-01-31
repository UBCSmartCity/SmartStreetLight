

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnergyCard from "@/components/EnergyCard";
import Card from "@/components/Card";
import { testData } from "@/testData";
import Controls from "@/components/Controls";
import PowerCard from "@/components/PowerCard"


export default function Home() {


  const data = testData; // fetch from db 


  return (


    <div className="h-screen w-screen p-5 text-center">

      <Header></Header>

      <main className="flex h-screen">
        <div className="flex flex-col items-center">
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md">
            {/* Controls Component */}
            <Controls />

            {/* List of Information */}
            <p className="text-cyan-400 mt-4">Light Status</p>
            <p className="text-gray-300">ON</p>

            <p className="text-cyan-400 mt-4">Brightness Level</p>
            <p className="text-gray-300">75%</p>

            <p className="text-cyan-400 mt-4">Battery Status</p>
            <p className="text-gray-300">Charging</p>

            <p className="text-cyan-400 mt-4">Sensor Health</p>
            <p className="text-gray-300">Good</p>
          </div>
        </div>


        {/*      
        <div className="grid grid-cols-1">
          <Controls></Controls>
          <Card type="Light Status" value={testData[0].lightStatus} />
          <Card type="Brightness Level" value={`${testData[0].brightnessLevel}%`} />
          <Card type="Battery Status" value={testData[0].batteryStatus} />
          <Card type="Sensor Health" value={testData[0].sensorHealth} />
        </div>  */}






        <div className="flex-grow h-full">

          <EnergyCard fetchedData={data}></EnergyCard>
          <PowerCard fetchedData={data}></PowerCard>
        </div>



      </main>


      <Footer></Footer>

    </div>

  );
}
