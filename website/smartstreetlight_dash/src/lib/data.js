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

// Add a reading with rando power consumption and 0 energy usage
export async function addStreetlightData(formData) {
  const startDate = new Date();

  // Optional: reset minutes, seconds, ms to zero for clean hour increments
  startDate.setMinutes(0, 0, 0);

  const lightIdRaw = formData.get("id");
  const lightId = Number(lightIdRaw);

  if (isNaN(lightId)) {
    throw new Error("Invalid lightId");
  }

  try {
    await prisma.streetlightReading.create({
      data: {
        reading_time: new Date(startDate),
        energy_usage: 0,
        light_status: "ON",
        brightness_level: 90,
        power_consumption: Math.floor(Math.random() * 300),
        battery_status: 85,
        sensor_health: "Good",
        light_id: lightId,
      },
    });

  } catch (err) {
    console.error("Insert failed:", err);
  }


}


// Add 10 incremental readings for the given light ID
export async function addDataIncrementally(formData) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 1); // go back 1 day (yesterday)

  // Optional: reset minutes, seconds, ms to zero for clean hour increments
  startDate.setMinutes(0, 0, 0);

  const lightIdRaw = formData.get("id");
  const lightId = Number(lightIdRaw);

  if (isNaN(lightId)) {
    throw new Error("Invalid lightId");
  }

  for (let i = 0; i < 10; i++) {
    try {
      await prisma.streetlightReading.create({
        data: {
          reading_time: new Date(startDate), // copy of current startDate
          energy_usage: Math.floor(Math.random() * 300),
          light_status: "ON",
          brightness_level: 90,
          power_consumption: Math.floor(Math.random() * 300),
          battery_status: 85,
          sensor_health: "Good",
          light_id: lightId,
        },
      });

      // Increment the reading time by 1 hour
      startDate.setHours(startDate.getHours() + 1);

      // Optional delay for realism
      await new Promise((res) => setTimeout(res, 10000));
    } catch (err) {
      console.error("Insert failed:", err);
    }
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


