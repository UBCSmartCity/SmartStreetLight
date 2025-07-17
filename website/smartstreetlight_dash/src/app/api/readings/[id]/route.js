
import prisma from "@/lib/prisma";

// route handler for fetching all streetlight data

export async function GET(request, { params }) {

    const { id } = await params;


    const data = await prisma.Streetlight.findUnique({
        where: {
            id: parseInt(id)
        },
        select: {
            readings: {
                orderBy: { reading_time: 'asc' }
            }
        },

    });
    return Response.json(data?.readings || []);
}


