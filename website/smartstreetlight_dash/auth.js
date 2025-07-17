import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user }) {


      try {

        const authorizedEmails = await prisma.EngineerEmail.findMany({
          where: {
            email: user.email
          }
        });


        await prisma.loginHistory.create({
          data: {
            email: user.email,
          },
        });



        return authorizedEmails.length >= 1
          ? true
          : "http://localhost:3000/redirectpage/You%20are%20not%20authorized%20to%20view%20this%20page!";
      } catch (err) {
        return "http://localhost:3000/redirectpage/Something%20went%20wrong%21";
      }




    },

    authorized: async ({ auth }) => {
      return !!auth
    },


  }
});