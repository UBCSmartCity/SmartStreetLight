"use client";

import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();

  const handleLogin = async () => {
    // Simulate login logic here (e.g., authentication)
    // After successful login, redirect to the dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8">Login</h1>
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Login
      </button>
    </div>
  );
}
