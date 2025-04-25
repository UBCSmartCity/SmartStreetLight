import { auth } from "@/../auth";
import BackButton from "@/components/BackButton";
import { addAdminServerAction, removeAdminServerAction } from "@/lib/data";

export default async function AdminPage() {
  const session = await auth();
  console.log(session);
  if (!session?.user) return <h1>not authorized</h1>;
  // if (session.user.email !== "alvintsui95@gmail.com") return <NotAdmin />;

  const reqEmails = await fetch("http://localhost:3000/get-emails");

  console.log(reqEmails);

  if (!reqEmails.ok) {
    console.log("ERROR");
    throw new Error("Cannot fetch emails");
  }

  const emailObjs = await reqEmails.json();

  console.log(await emailObjs);

  const email = session.user.email;
  const name = session.user.name;
  const img = session.user.image;

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 bg-gray-100 shadow-lg p-6 flex flex-col items-center">
        <img
          src={img}
          referrerPolicy="no-referrer"
          alt="User profile"
          className="rounded-full w-24 h-24 object-cover mb-4 border border-blue-600"
        />
        <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
        <p className="text-sm text-gray-600">{email}</p>
        <div className="mt-6">
          <BackButton />
        </div>
      </aside>

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-blue mb-6">Admin Panel</h1>

        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray">
            Manage Authorized Emails
          </h2>

          <form action={addAdminServerAction} className="flex gap-2 mb-6">
            <input
              type="email"
              name="email"
              placeholder="test@example.com"
              className="flex-1 border border-gray p-2 rounded"
              required
            />
            <button
              type="submit"
              className="bg-blue text-gray px-4 py-2 rounded hover:bg-inherit transition"
            >
              Add
            </button>
          </form>

          {emailObjs.length === 0 ? (
            <p className="text-gray">No emails added.</p>
          ) : (
            <ul className="space-y-3">
              {emailObjs.map((obj) => (
                <li
                  key={obj.email}
                  className="flex justify-between items-center p-3 rounded shadow-sm"
                >
                  <span className="text-gray">{obj.email}</span>
                  <form action={removeAdminServerAction}>
                    <input type="hidden" name="email" value={obj.email} />
                    <button
                      type="submit"
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
