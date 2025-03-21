import { FaBatteryThreeQuarters } from "react-icons/fa6";
import { MdBrightness4, MdHealthAndSafety } from "react-icons/md";
import { FaRegLightbulb } from "react-icons/fa";

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
      default:
        return <FaBatteryThreeQuarters />;
    }
  }

  return (
    <div className="flex flex-col text-center bg-gray-700 p-4 rounded-md w-5/6">
      <section className=" m-auto">
        <h2 className="text-xl text-cyan-400 mb-2">{type}</h2>
        <p className="text-sm text-gray-300">{value}</p>
      </section>
      {getIcon(type)}
    </div>
  );
}
