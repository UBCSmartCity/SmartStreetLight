
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
      // profile(profile) {
      //   console.log('profile', profile);
      //   return { role: profile.role ?? "user" }
      // }
    }),
  ],
  callbacks: {
    async signIn({ user }) {

      const authorizedEmails = await loadAuthorizedEmails();
      console.log('these are authorized emails', authorizedEmails);

      console.log('these will be saved to login history table', user, new Date())

      // TODO: store in db
      // const res = await fetch('URL', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     user: user,
      //     date: new Date(),
      //     // TODO: location
      //   }),
      // })

      return authorizedEmails.includes(user.email)
        ? true
        : "http://localhost:3000/redirectpage";
    }
  },
});


