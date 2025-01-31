export default function Header() {
    const location = "UBC Campus";
    const lastUpdated = "February 1, 2025 at 12:41 PM"; // fetch from db later on

    return (
        <nav className="bg-gray-800 text-white p-3 flex justify-evenly items-center shadow-lg">
            <h1 className="text-xl font-semibold text-cyan-400">Smart Streetlight Dashboard</h1>
            <div className="text-sm text-gray-300 flex gap-3">
                <span>📍 {location}</span>
                <span>⏳ {lastUpdated}</span>
            </div>
        </nav>
    );
}
