"use server";

import prisma from "@/lib/prisma";

// go to /seed to populate database with sample data,
export async function GET() {


    const data = await prisma.AllowedEmails.findMany({
        select: {
            email: true
        }
    });
    return Response.json(data);





}
