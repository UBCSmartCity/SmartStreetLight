// import { auth } from "@/../auth";

// import {
//   addAdminServerAction,
//   getEmails,
//   removeAdminServerAction,
// } from "@/lib/data";
// import { revalidatePath } from "next/cache";

// export default async function AdminPage() {
//   const session = await auth();

//   // TODO: change this to server side auth
//   if (!session?.user) return <h1>not authorized</h1>;

//   if (session?.user.email !== "alvintsui95@gmail.com")
//     return <h1>not authorized</h1>;
//   const emails = await getEmails();

//   return (
//     <div className="max-w-md mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Email List</h1>

//       <form action={addAdminServerAction} className="flex gap-2 mb-4">
//         <input
//           type="email"
//           name="email"
//           placeholder="admin@example.com"
//           className="flex-1 border p-2 rounded"
//           required
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Add
//         </button>
//       </form>

//       {emails.length === 0 ? (
//         <p className="text-gray-500">No admins added.</p>
//       ) : (
//         <ul className="space-y-2">
//           {emails.map((email) => (
//             <li
//               key={email}
//               className="flex justify-between items-center bg-gray-100 p-2 rounded"
//             >
//               <span>{email}</span>
//               <form action={removeAdminServerAction}>
//                 <input type="hidden" name="email" value={email} />
//                 <button type="submit" className="text-red-500 hover:underline">
//                   Remove
//                 </button>
//               </form>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

import { auth } from "@/../auth";
import BackButton from "@/components/BackButton";
import {
  addAdminServerAction,
  getEmails,
  removeAdminServerAction,
} from "@/lib/data";
import { revalidatePath } from "next/cache";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) return <h1>not authorized</h1>;
  if (session.user.email !== "alvintsui95@gmail.com")
    return <h1>not authorized</h1>;

  const emails = await getEmails();

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Email List</h1>
      <BackButton />

      <form action={addAdminServerAction} className="flex gap-2 mb-4">
        <input
          type="email"
          name="email"
          placeholder="admin@example.com"
          className="flex-1 border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      {emails.length === 0 ? (
        <p className="text-gray-500">No admins added.</p>
      ) : (
        <ul className="space-y-2">
          {emails.map((email) => (
            <li
              key={email}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <span>{email}</span>
              <form action={removeAdminServerAction}>
                <input type="hidden" name="email" value={email} />
                <button type="submit" className="text-red-500 hover:underline">
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
