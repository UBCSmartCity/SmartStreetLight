export default function Card({ type, value }) {
    return (
        <div className="text-center bg-gray-700 p-4 rounded-md shadow-sm m-2 h-1/2">
            <h2 className="text-xl text-cyan-400 mb-1">{type}</h2>
            <p className="text-sm text-gray-300">{value}</p>
        </div>
    );
}
