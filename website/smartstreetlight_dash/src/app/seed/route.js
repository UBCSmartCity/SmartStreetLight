"use server";

import prisma from "@/lib/prisma";

// go to /seed to populate database with sample data,
export async function GET() {





  //   try {

  // const streetlight = await prisma.Streetlight.update({
  //   where: {
  //     id: 1,
  //   },
  //   data: {
  //     id: '',
  //   },
  // })

  //     return Response.json(streetlight);

  //   } catch (err) {
  //     return Response.json(err);

  //   }



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



  try {

    const sampleData = await prisma.StreetlightReading.createMany({
      data: [{
        energy_usage: Math.floor(Math.random() * 300),
        brightness_level: 90,
        reading_time: new Date(),
        light_status: "ON",
        power_consumption: 0,
        battery_status: 85,
        sensor_health: "Good",
        light_id: 2
      },
      {
        energy_usage: Math.floor(Math.random() * 300),
        brightness_level: 90,
        reading_time: new Date(),
        light_status: "ON",
        power_consumption: Math.floor(Math.random() * 300),
        battery_status: 85,
        sensor_health: "Good",
        light_id: 2
      }],
    });
    return Response.json(sampleData);
  } catch (err) {
    return Response.json(err.message);
  }


}
