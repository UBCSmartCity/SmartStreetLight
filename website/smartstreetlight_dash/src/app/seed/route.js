"use server";

import prisma from "@/lib/prisma";

// go to /seed to populate database with sample data,
export async function GET() {



  try {

    const sampleData = await prisma.LangaraReadings.createMany({
      data: [{
        reading_time: new Date('2025-06-04'),
        energy_usage: 600,
        light_status: "ON",
        brightness_level: 90,
        power_consumption: 75,
        battery_status: 85,
        sensor_health: "Good",
      },
      {
        reading_time: new Date('2025-06-05'),
        energy_usage: 200,
        light_status: "ON",
        brightness_level: 90,
        power_consumption: 75,
        battery_status: 85,
        sensor_health: "Good",
      }],
    });
    return Response.json(sampleData);
  } catch (err) {
    return Response.json(err.message);
  }


}
