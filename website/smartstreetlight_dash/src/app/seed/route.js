"use server";

import prisma from "@/lib/prisma";

// go to /seed to populate database with sample data,
export async function GET() {
  const testTwo = await prisma.streetLightData.create({
    data: {},
  });
  return Response.json(testTwo);
}
