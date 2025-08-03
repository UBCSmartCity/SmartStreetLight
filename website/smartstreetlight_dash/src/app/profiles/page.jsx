import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function ProfileSelection() {
  // TODO: fetch profiles from a database

  // Example profiles, replace with dynamic fetching
  // const profiles = [
  //   { location: "UBC Nest", route: "dashboard?location=nest&id=1" },
  //   { location: "UBC Bigway", route: "dashboard?location=bigway&id=2" },
  //   { location: "Richmond Centre", route: "dashboard?location=rc&id=3" },
  // ];

  const profiles = await prisma.Streetlight.findMany({
    select: {
      id: true,
      location: true,
      name: true,
    },
  });

  console.log("profiles:", profiles);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-gray">
      <h1 className="text-3xl mb-2">Choose a Streetlight</h1>
      <p className="mb-6 text-gray-400">
        Control and monitor streetlight activity through real-time dashboards.
      </p>
      <div className="flex gap-6">
        {profiles.map((profile) => (
          <Link
            href={`dashboard?location=${profile.name}&id=${profile.id}`}
            key={profile.name}
          >
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-center w-52">
              <h2 className="text-lg font-semibold">{profile.name}</h2>
              <h2 className="text-xs font-semibold">{profile.location}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
