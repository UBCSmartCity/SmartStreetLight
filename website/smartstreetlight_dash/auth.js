import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";


// Helper to load authorized emails
// async function loadAuthorizedEmails() {
//   const filePath = path.resolve("./src/adminEmails.json");
//   const data = await fs.readFile(filePath, "utf-8");
//   return JSON.parse(data);
// }

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'select_account'
        },
      },
    }),
  ],
  // session: { strategy: 'jwt' }, //jwt

  callbacks: {
    async signIn({ user }) {


      const authorizedEmails = await prisma.AllowedEmails.findMany({
        select: {
          email: true
        },
        where: {
          email: user.email
        }
      });


      return authorizedEmails.length >= 1
        ? true
        : "http://localhost:3000/redirectpage";
    }, authorized: async ({ auth }) => {
      return !!auth
    },


  }
});