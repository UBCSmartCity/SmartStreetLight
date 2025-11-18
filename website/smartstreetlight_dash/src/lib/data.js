"use server";
import { revalidatePath } from 'next/cache';
import prisma from "@/lib/prisma";


// reverse geocode - latitude and longitude to an address
export async function getAddress(lat, long) {
  const t = await fetch(
    `https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=${process.env.MAPKEY}`
  );

  const loc = await t.json();

  return (
    loc.address.building ||
    `${loc.display_name.split(", ")[0]} ${loc.display_name.split(", ")[1]}` ||
    "Location not detected"
  );
}

// inserting data provided by location parameter, used for testing after db refactor
export async function addStreetlightData(lightId) {

  try {
    const reading = await prisma.StreetlightReadings.createMany({
      data: {
        energy_usage: Math.floor(Math.random() * 300),
        brightness_level: 90,
        reading_time: new Date(),
        light_status: "ON",
        power_consumption: Math.floor(Math.random() * 300),
        battery_status: 85,
        sensor_health: "Good",
        light_id: lightId
      },
    })
  } catch (err) {
    console.log(err); // TODO: client error handling 
  }


}



// TODO: change this to match refactored db 
export async function addDataIncrementally() {


  const startDate = new Date();
  startDate.setMinutes(startDate.getMinutes() - 11);


  for (let i = 0; i < 10; i++) {


    try {
      const data = await prisma.LangaraReadings.create({
        data: {
          reading_time: startDate,
          energy_usage: Math.floor(Math.random() * 300),
          light_status: "ON",
          brightness_level: 90,
          power_consumption: Math.floor(Math.random() * 300),
          battery_status: 85,
          sensor_health: "Good",
        },
      });

    } catch (err) {
      throw new Error(err);
    }

    setTimeout(() => { }, 3000);

    startDate.setMinutes(startDate.getMinutes() + 1);


  }


}



// TODO: zod form validation after converting to TS 
// add engineer emails to db 
export async function addEngineerEmail(formData) {

  const newEmail = formData.get("email");
  try {
    const testTwo = await prisma.EngineerEmail.create({
      data: {
        email: newEmail,
        admin: false
      },
    })

  } catch (err) {
    throw new Error('Failed to Create');
  }


  revalidatePath('/admin');
}


// remove emails from db
export async function removeEngineerEmail(id, formData) {

  console.log(id);
  try {
    const deleteUser = await prisma.EngineerEmail.delete({
      where: {
        id
      },
    })
  } catch (err) {
    throw new Error('Failed to Delete');
  }


  revalidatePath('/admin');

}


