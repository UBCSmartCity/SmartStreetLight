"use server";

import prisma from "@/lib/prisma";

// go to /seed to populate database with sample data,
export async function GET(request, { params }) {

    const { email } = await params;

    const data = await prisma.AdminEmails.findMany({
        where: {
            email: email
        }
    });
    return Response.json(data);





}
