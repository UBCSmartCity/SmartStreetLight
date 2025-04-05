"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={router.back}
      className="mt-4 bg-gray text-blue px-4 py-2 rounded hover:opacity-90 transition"
    >
      ← Go Back
    </button>
  );
}
