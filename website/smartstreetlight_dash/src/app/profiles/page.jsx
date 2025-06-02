import Link from "next/link";

export default function ProfileSelection() {
  const profiles = [
    { location: "Langara", route: "dashboard?location=langara" },
    { location: "UBC Nest", route: "dashboard?location=nest" },
    { location: "UBC Bigway", route: "dashboard?location=bigway" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-gray">
      <h1 className="text-3xl mb-2">Choose a Streetlight</h1>
      <p className="mb-6 text-gray-400">
        Control and monitor streetlight activity through real-time dashboards.
      </p>
      <div className="flex gap-6">
        {profiles.map((profile) => (
          <Link href={profile.route} key={profile.location}>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-center w-52">
              <h2 className="text-lg font-semibold">{profile.location}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
