"use client";

import { useState } from "react";

// TODO: implement test user/pass in database
const profiles = [
  {
    id: 1,
    name: "Langara",
    password: "pass123",
  },
  {
    id: 2,
    name: "UBC Nest",
    password: "secure456",
  },
  {
    id: 3,
    name: "SFU",
    password: "charlie789",
  },
];

export default function ProfileSwitcher() {
  const [loggedInProfiles, setLoggedInProfiles] = useState([]);
  const [passwordInputs, setPasswordInputs] = useState({});
  const [error, setError] = useState({});

  function handleLogin(profile) {
    if (passwordInputs[profile.id] === profile.password) {
      if (!loggedInProfiles.some((p) => p.id === profile.id)) {
        setLoggedInProfiles([...loggedInProfiles, profile]);
        setError({ ...error, [profile.id]: "" });
      }
    } else {
      setError({ ...error, [profile.id]: "Incorrect password" });
    }
  }

  function handleLogout(profileId) {
    setLoggedInProfiles(loggedInProfiles.filter((p) => p.id !== profileId));
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Switch Profiles</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="p-4 border rounded-lg shadow-md text-center bg-white"
          >
            <h2 className="text-lg font-semibold">{profile.name}</h2>
            {loggedInProfiles.some((p) => p.id === profile.id) ? (
              <button
                onClick={() => handleLogout(profile.id)}
                className="mt-3 px-4 py-2  text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <div className="mt-3">
                <input
                  type="password"
                  placeholder="Enter password"
                  className="p-2 border rounded w-full"
                  value={passwordInputs[profile.id] || ""}
                  onChange={(e) =>
                    setPasswordInputs({
                      ...passwordInputs,
                      [profile.id]: e.target.value,
                    })
                  }
                />
                {error[profile.id] && (
                  <p className="text-red-500 text-sm mt-1">
                    {error[profile.id]}
                  </p>
                )}
                <button
                  onClick={() => handleLogin(profile)}
                  className="mt-2 px-4 py-2 bg-emerald-400 text-white rounded-lg hover:bg-blue-600 w-full"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
