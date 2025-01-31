

export default function Header() {

    const location = 'UBC Campus';
    const lastUpdated = 'February 1, 2025 at 12:41 PM'; // fetch from db later on

    return (
        <div className="text-center p-5 bg-gray-700 text-white rounded-lg shadow-lg">
            <h1 className="text-3xl text-cyan-400 mb-3">Smart Streetlight Dashboard</h1>
            <h2 className="text-lg text-gray-300 mb-1">Location: {location}</h2>
            <h2 className="text-lg text-gray-300">Last updated: {lastUpdated}</h2>
        </div>


    );
}