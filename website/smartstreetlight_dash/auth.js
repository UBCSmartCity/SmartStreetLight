
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"


// hard coded "whitelist"

const authorizedEmails = ["alvintsui95@gmail.com", "alvintsui255@gmail.com"]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      const email = user.email;

      if (authorizedEmails.includes(email)) {
        return true;
      }

      return "http://localhost:3000/redirectpage";
    }
  }
})

// TODO: use middleware and callbacks to guard api calls
// https://authjs.dev/getting-started/session-management/protecting?framework=Next.js%2520%28Client%29