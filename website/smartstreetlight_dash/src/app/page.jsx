

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnergyCard from "@/components/EnergyCard";



export default function Home() {


  const singleData = ""; // fetch from db 
  const graphData = "";
  
  


  return (
    

    <div className="h-screen w-screen">

      <Header></Header>

      <div className="flex">
        <div className="w-1/4 h-1/4 text-center">
          <h2>Light Status</h2>
          <p className="metric-value">ON</p>
        </div>
        <div className="monitor-box">
          <h2>Brightness Level</h2>
          <p className="metric-value">75%</p>
        </div>
        <div className="monitor-box">
          <h2>Battery Status</h2>
          <p className="metric-value">Charging</p>
        </div>
        <div className="monitor-box">
          <h2>Sensor Health</h2>
          <p className="metric-value">Good</p>
        </div>
      </div>

      

      <EnergyCard></EnergyCard>
      <Footer></Footer>

    </div>

  );
}
