
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
})

// TODO: use middleware and callbacks to guard api calls
// https://authjs.dev/getting-started/session-management/protecting?framework=Next.js%2520%28Client%29