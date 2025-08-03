import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";


export const { handlers, signIn, signOut, auth } = NextAuth({
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
  callbacks: {
    async signIn({ user }) {


      // check if user is authorized
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

    // middleware 
    authorized: async ({ auth }) => {
      return !!auth
    },


  }
});