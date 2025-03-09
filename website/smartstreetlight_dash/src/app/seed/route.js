"use server";

import prisma from "@/lib/prisma";

// go to /seed to populate database with sample data,
export async function GET() {
  const testTwo = await prisma.streetLightData.createManyAndReturn({
    data: [
      {
        date: new Date("2025-03-01T01:30:10"),
        energyUsage: 1,
        lightStatus: "ON",
        brightnessLevel: 70,
        powerConsumption: 50,
        batteryStatus: 90,
        sensorHealth: "Good",
        location: "Langara 49th Station",
      },
      {
        date: new Date("2025-03-02T02:10:10"),
        energyUsage: 220,
        lightStatus: "ON",
        brightnessLevel: 85,
        powerConsumption: 55,
        batteryStatus: 80,
        sensorHealth: "Good",
        location: "Langara 49th Station",
      },
      {
        date: new Date("2025-03-03T12:45:10"),
        energyUsage: 300,
        lightStatus: "OFF",
        brightnessLevel: 90,
        powerConsumption: 75,
        batteryStatus: 75,
        sensorHealth: "Warning",
        location: "Langara 49th Station",
      },
      {
        date: new Date("2025-03-04T13:55:10"),
        energyUsage: 250,
        lightStatus: "ON",
        brightnessLevel: 70,
        powerConsumption: 80,
        batteryStatus: 65,
        sensorHealth: "Good",
        location: "Langara 49th Station",
      },
      {
        date: new Date("2025-03-05T14:20:10"),
        energyUsage: 280,
        lightStatus: "ON",
        brightnessLevel: 80,
        powerConsumption: 60,
        batteryStatus: 85,
        sensorHealth: "Good",
        location: "Langara 49th Station",
      },
      {
        date: new Date("2025-03-06T06:30:10"),
        energyUsage: 340,
        lightStatus: "OFF",
        brightnessLevel: 60,
        powerConsumption: 90,
        batteryStatus: 55,
        sensorHealth: "Warning",
        location: "Langara 49th Station",
      },
      {
        date: new Date("2025-03-07T09:40:10"),
        energyUsage: 190,
        lightStatus: "ON",
        brightnessLevel: 75,
        powerConsumption: 50,
        batteryStatus: 95,
        sensorHealth: "Good",
        location: "Langara 49th Station",
      },
      {
        date: new Date("2025-03-08T11:50:10"),
        energyUsage: 350,
        lightStatus: "ON",
        brightnessLevel: 80,
        powerConsumption: 70,
        batteryStatus: 70,
        sensorHealth: "Warning",
        location: "Langara 49th Station",
      },
    ],
    skipDuplicates: true,
  });

  console.log(testTwo);
  return Response.json(testTwo);
}
