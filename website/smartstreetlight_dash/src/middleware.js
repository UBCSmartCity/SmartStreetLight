export { auth as middleware } from "../auth"
export const config = {
    matcher: ['/dashboard', '/profiles', '/admin'],
}




// custom logic middleware
// import { auth } from "@/../auth"
// import prisma from "./lib/prisma";

// export default auth(async (req) => {
//     //   if (!req.auth && req.nextUrl.pathname !== "/login") {
//     //     const newUrl = new URL("/login", req.nextUrl.origin)
//     //     return Response.redirect(newUrl)
//     //   }


//     console.log('req', req);
// })