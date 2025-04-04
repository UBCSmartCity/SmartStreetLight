
// import NextAuth from "next-auth"
// import Google from "next-auth/providers/google"


// // hard coded "whitelist"

// const authorizedEmails = ["alvintsui95@gmail.com", "alvintsui255@gmail.com"]

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Google({
//       clientId: process.env.AUTH_GOOGLE_ID,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET
//     })
//   ],
//   callbacks: {
//     async signIn({ user, account, profile, credentials }) {
//       const email = user.email;

//       if (authorizedEmails.includes(email)) {
//         return true;
//       }

//       return "http://localhost:3000/redirectpage";
//     }
//   }
// })

// // TODO: use middleware and callbacks to guard api calls
// // https://authjs.dev/getting-started/session-management/protecting?framework=Next.js%2520%28Client%29

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import fs from "fs/promises";
import path from "path";

// Helper to load authorized emails
async function loadAuthorizedEmails() {
  const filePath = path.resolve("./src/adminEmails.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {

      const authorizedEmails = await loadAuthorizedEmails();
      console.log('these are authorized emails', authorizedEmails)
      return authorizedEmails.includes(user.email)
        ? true
        : "http://localhost:3000/redirectpage";
    },
  },
});
