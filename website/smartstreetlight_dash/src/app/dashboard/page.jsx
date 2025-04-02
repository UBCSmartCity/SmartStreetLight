import Dashboard from "./dashboard";
import { auth } from "../../../auth";

export default async function Page() {
  const session = await auth();

  if (!session) return <div>Not authenticated</div>;

  return <Dashboard />;
}
