import { signIn } from "@/../../auth";
import { headers } from "next/headers";

// main sign-in page
export default async function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-boxes p-8 rounded-2xl shadow-sm border border-border w-full max-w-md flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-center tracking-wide">
          Smart Streetlight
        </h1>

        <p className="text-gray text-sm text-center">
          Sign in to access your dashboard and profile.
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/profiles" });
          }}
          className="w-full"
        >
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-full bg-blue text-white text-sm font-semibold hover:bg-blue/90 transition-all shadow-md"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
