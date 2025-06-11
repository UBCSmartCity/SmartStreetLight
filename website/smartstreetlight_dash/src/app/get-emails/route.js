"use server";

import prisma from "@/lib/prisma";

// go to /get-emails to see all authorized engineer accounts 
export async function GET() {


    const data = await prisma.EngineerEmails.findMany({
        select: {
            email: true
        }
    });
    return Response.json(data);





}
