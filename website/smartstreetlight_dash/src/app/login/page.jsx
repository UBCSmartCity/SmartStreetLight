import { signIn } from "@/../../auth";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/profiles" });
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
  );
}

// TODO FOR FRIDAY
// test continuous fetch and incremetal data inserts with pi, also check the 5 cards
// admin add/remove emails
// styling
