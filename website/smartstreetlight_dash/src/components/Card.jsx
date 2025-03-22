import { FaBatteryThreeQuarters } from "react-icons/fa6";
import { MdBrightness4, MdHealthAndSafety } from "react-icons/md";
import { FaRegLightbulb } from "react-icons/fa";
import { CiTimer } from "react-icons/ci";

export default function Card({ type, value }) {
  function getIcon(type) {
    switch (type) {
      case "Brightness":
        return <MdBrightness4 />;
      case "Battery":
        return <FaBatteryThreeQuarters />;
      case "Sensor Health":
        return <MdHealthAndSafety />;
      case "Light Status":
        return <FaRegLightbulb />;
      case "Last Updated":
        return <CiTimer />;
      default:
        return <FaBatteryThreeQuarters />;
    }
  }

  return (
    <div className="flex flex-col text-center bg-gray-700 p-1 rounded-md w-5/6 h-full">
      <section className="m-auto w-full">
        <div className="flex justify-center items-center gap-2 mb-2">
          <h2 className="text-xl text-cyan-400">{type}</h2>
          <span className="flex items-center">{getIcon(type)}</span>
        </div>
        <p className="text-base text-gray-300">{value}</p>
      </section>
    </div>
  );
}
