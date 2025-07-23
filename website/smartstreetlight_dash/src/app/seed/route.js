"use server";

import prisma from "@/lib/prisma";

// go to /seed to populate database with sample data,
export async function GET() {


  // Generate a random date within July 2025
  function randomDateInJuly2025() {
    const start = new Date('2025-07-01T00:00:00');
    const end = new Date('2025-07-21T23:59:59');
    const offset = Math.random() * (end.getTime() - start.getTime());
    return new Date(start.getTime() + offset);
  }

  // Generate a random float between min and max
  function rand(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  }

  async function seedReadings(lightId) {
    const readings = Array.from({ length: 12 }).map(() => ({
      light_id: lightId,
      energy_usage: rand(5, 15),
      brightness_level: rand(40, 100),
      power_consumption: rand(10, 20),
      battery_status: rand(60, 100),
      sensor_health: ['Good', 'Fair', 'Excellent', 'Needs Maintenance'][Math.floor(Math.random() * 4)],
      light_status: Math.random() > 0.5 ? 'ON' : 'OFF',
      reading_time: randomDateInJuly2025(),
    }));

    // Insert in batches to avoid hitting parameter limits
    const batchSize = 1000;
    for (let i = 0; i < readings.length; i += batchSize) {
      await prisma.streetlightReading.createMany({ data: readings.slice(i, i + batchSize) });
    }
  }

  async function main() {
    await seedReadings(1); // UBC Nest
    await seedReadings(2); // Bigway

    console.log('✅ Seeded 10 readings each for Nest and Bigway');
  }

  main();

  return Response.json("seeded");


}
