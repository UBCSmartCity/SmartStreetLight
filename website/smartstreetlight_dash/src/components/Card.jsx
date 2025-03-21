export default function Card({ type, value }) {
  return (
    <div className="flex flex-col text-center bg-gray-700 p-4 rounded-md w-5/6">
      <section className=" m-auto">
        <h2 className="text-xl text-cyan-400 mb-2">{type}</h2>
        <p className="text-sm text-gray-300">{value}</p>
      </section>
    </div>
  );
}
