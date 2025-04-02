import { auth } from "@/../auth";

// auth test, if logged into google, will return authorized
export default async function UserAvatar() {
  const session = await auth();

  if (!session?.user) return <h1>not authorized</h1>;

  return (
    <div>
      <h1>authorized</h1>
      <div>
        <img src={session.user.image} alt="User Avatar" />
      </div>
    </div>
  );
}
