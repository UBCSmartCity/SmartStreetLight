// "use client";

import { signIn } from "@/../../auth";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-boxes p-8 rounded-xl shadow-md border border-border w-full max-w-md flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold text-foreground">Welcome Back</h1>
        <p className="text-muted text-sm text-center">
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
            className="w-full py-2 px-4 rounded-full bg-blue text-white text-sm font-medium hover:bg-blue/90 transition-all shadow"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}

// TODO FOR FRIDAY
// test continuous fetch and incremetal data inserts with pi, also check the 5 cards
// admin add/remove emails
// styling
