import Dashboard from "./dashboard";
import { auth } from "../../../auth";
import Temp from "../redirectpage/temp";
import { redirect } from "next/dist/server/api-utils";

export default async function Page() {
  // const session = await auth();

  // if (!session) return <Temp />;

  return <Dashboard />;
}
