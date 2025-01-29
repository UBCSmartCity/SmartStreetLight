

export default function Header() {

    const location = 'UBC Campus';
    const lastUpdated = 'November 9, 2024 at 12:41 PM'; // fetch from db later on

    return (

        <div>
            <h1>Smart Streetlight Dashboard</h1>
            <h2>Location {location}</h2>
            <h2>Last updated: {lastUpdated}</h2>
        </div>
    );
}