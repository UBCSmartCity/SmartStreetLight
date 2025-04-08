import Dashboard from "./dashboard";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";

export default async function Page() {
  // NOTE: comment these first two lines if you don't have access to OAuth keys
  // const session = await auth();
  // if (!session) return redirect("/redirectpage");

  return <Dashboard />;
  // test
  // test
}
