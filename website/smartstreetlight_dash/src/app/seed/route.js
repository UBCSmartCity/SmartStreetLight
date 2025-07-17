"use server";

import prisma from "@/lib/prisma";

// go to /seed to populate database with sample data,
export async function GET() {

  // Generate a random date within the last N days
  function randomDateWithinPastDays(days) {
    const now = new Date();
    const offset = Math.random() * days * 24 * 60 * 60 * 1000;
    return new Date(now.getTime() - offset);
  }

  // Generate a random float between min and max
  function rand(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  }

  async function seedReadings(lightId) {
    const readings = Array.from({ length: 10 }).map(() => ({
      light_id: lightId,
      energy_usage: rand(5, 15),
      brightness_level: rand(40, 100),
      power_consumption: rand(10, 20),
      battery_status: rand(60, 100),
      sensor_health: ['Good', 'Fair', 'Excellent', 'Needs Maintenance'][Math.floor(Math.random() * 4)],
      light_status: Math.random() > 0.5 ? 'ON' : 'OFF',
      reading_time: randomDateWithinPastDays(14),
    }));

    await prisma.streetlightReading.createMany({ data: readings });
  }

  async function main() {
    await seedReadings(1); // UBC Nest
    await seedReadings(2); // Bigway

    console.log('✅ Seeded 10 readings each for Nest and Bigway');
  }

  main();

  return Response.json("seeded");


}
