"use server";

import prisma from "@/lib/prisma";


export async function GET(request, { params }) {

    const { email } = await params;

    const data = await prisma.EngineerEmails.findMany({
        where: {
            email: email
        }
    });
    return Response.json(data);





}
