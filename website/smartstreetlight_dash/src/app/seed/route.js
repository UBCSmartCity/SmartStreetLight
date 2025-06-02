"use server";

import prisma from "@/lib/prisma";

// go to /seed to populate database with sample data,
export async function GET() {



  try {

    const testTwo = await prisma.LangaraData.create({
      data: {
        reading_time: new Date(),
        energy_usage: 100,
        light_status: "ON",
        brightness_level: 90,
        power_consumption: 75,
        battery_status: 85,
        sensor_health: "Good",
        location: "Langara 49th Station",
      },
    });
    return Response.json(testTwo);
  } catch (err) {
    return Response.json(err.message);
  }


}
