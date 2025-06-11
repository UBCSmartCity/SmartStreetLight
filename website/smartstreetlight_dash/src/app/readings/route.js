'use server'


import prisma from "@/lib/prisma";

// route handler for fetching all streetlight data


// for pi db 
export async function GET(req) {

  console.log(req.url);

  const id = req.nextUrl.searchParams.get("id")



  console.log(id);
  const data = await prisma.Streetlight.findUnique({
    where: {
      id: parseInt(id)
    },
    select: {
      readings: true
    }
  });
  return Response.json(data?.readings || []);
}


// for primsa postgres db
// export async function GET() {
//   const data = await prisma.LangaraData.findMany();
//   return Response.json(data);
// }
