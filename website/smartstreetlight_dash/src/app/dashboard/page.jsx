import Dashboard from "./dashboard";
import { auth } from "../../../auth";
import Temp from "../redirectpage/temp";
import { redirect } from "next/dist/server/api-utils";

export default async function Page() {
  // NOTE: comment these first two lines if you don't have access to OAuth keys
  const session = await auth();
  if (!session) return <Temp />;

  return <Dashboard />;
  // test
}
