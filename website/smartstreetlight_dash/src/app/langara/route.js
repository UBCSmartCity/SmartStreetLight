'use server'


import prisma from "@/lib/prisma";

// route handler for fetching all streetlight data
export async function GET() {
  const data = await prisma.LangaraData.findMany();
  // const data = await prisma.User.findMany();
  return Response.json(data);
}
