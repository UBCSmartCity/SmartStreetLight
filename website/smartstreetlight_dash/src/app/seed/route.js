"use server";

import prisma from "@/lib/prisma";

// go to /seed to populate database with sample data,
export async function GET() {



  try {

    const email = await prisma.EngineerEmails.createMany({
      data: [{
        email: "alvintsui95@gmail.com"
      }, {
        email: "valoing5@gmail.com"
      }]
    })

    return Response.json(email);

  } catch (err) {
    return Response.json(err);

  }



  // try {
  //   const light = await prisma.Streetlight.createMany({
  //     data: [
  //       {
  //         id: 1,
  //         name: "UBC Nest",
  //         location: "UBC Campus",
  //         start_date: new Date()
  //       },
  //       {
  //         id: 2,
  //         name: "UBC Bigway",
  //         location: "UBC Campus",
  //         start_date: new Date('2024-04-05')
  //       }
  //     ]
  //   })

  //   return Response.json(light);
  // } catch (err) {
  //   return Response.json(err);

  // }



  // try {

  //   const sampleData = await prisma.LangaraReadings.createMany({
  //     data: [{
  //       reading_time: new Date('2025-06-04'),
  //       energy_usage: 600,
  //       light_status: "ON",
  //       brightness_level: 90,
  //       power_consumption: 75,
  //       battery_status: 85,
  //       sensor_health: "Good",
  //     },
  //     {
  //       reading_time: new Date('2025-06-05'),
  //       energy_usage: 200,
  //       light_status: "ON",
  //       brightness_level: 90,
  //       power_consumption: 75,
  //       battery_status: 85,
  //       sensor_health: "Good",
  //     }],
  //   });
  //   return Response.json(sampleData);
  // } catch (err) {
  //   return Response.json(err.message);
  // }


}
