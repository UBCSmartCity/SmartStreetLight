import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

export const dynamic = "force-static";

// route handler for fetching all streetlight data
export async function GET() {
  const data = await prisma.streetLightData.findMany();
  // console.log("route handler", data);
  return Response.json({ data }); // sends JSON
}
