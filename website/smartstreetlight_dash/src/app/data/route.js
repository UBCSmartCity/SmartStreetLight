import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

export const dynamic = "force-static";

// route handler for fetching all streetlight data
export async function GET() {
  const data = await prisma.streetLightData.findMany({
    orderBy: {
      date: "desc",
    },
  });
  return Response.json({ data }); // sends JSON
}
