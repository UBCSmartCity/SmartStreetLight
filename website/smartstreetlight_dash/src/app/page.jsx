

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnergyCard from "@/components/EnergyCard";
import Card from "@/components/Card";
import { testData } from "@/testData";
import Controls from "@/components/Controls";
import PowerCard from "@/components/PowerCard"


export default function Home() {


  const data = testData; // fetch from db 


  // TODO: remove overflow causing scroll bars 
  // TODO: merge energy and power into one component

  return (


    <div className="h-screen w-screen text-center">

      <Header></Header>

      <main className="flex h-screen">


        <div className="flex flex-col items-center m-5">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            {/* Controls Component */}
            <Controls />

            {/* List of Information */}
            <p className="text-cyan-400 mt-4">Light Status</p>
            <p className="text-gray-300">{testData[0].lightStatus}</p>

            <p className="text-cyan-400 mt-4">Brightness Level</p>
            <p className="text-gray-300">{`${testData[0].brightnessLevel}%`}</p>

            <p className="text-cyan-400 mt-4">Battery Status</p>
            <p className="text-gray-300">{testData[0].batteryStatus}</p>

            <p className="text-cyan-400 mt-4">Sensor Health</p>
            <p className="text-gray-300">{testData[0].sensorHealth}</p>
          </div>
        </div>







        <div className="flex-grow h-full w-fit">

          <EnergyCard fetchedData={data}></EnergyCard>
          <PowerCard fetchedData={data}></PowerCard>
        </div>



      </main>


      <Footer></Footer>

    </div>

  );
}
