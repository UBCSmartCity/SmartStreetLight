"use server";
import { revalidatePath } from 'next/cache';
import prisma from './prisma';


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




export async function addDataIncrementally() {
  // console.log('adding data');


  try {
    const data = await prisma.LangaraData.create({
      data: {
        reading_time: new Date(),
        energy_usage: Math.floor(Math.random() * 300),
        light_status: "ON",
        brightness_level: 90,
        power_consumption: Math.floor(Math.random() * 300),
        battery_status: 85,
        sensor_health: "Good",
        location: "Langara 49th Station",
      },
    });

  } catch (err) {
    throw new Error('Failed to Insert Data');
  }
}



// add emails to JSON file
export async function addAdminServerAction(formData) {

  const newEmail = formData.get("email");
  try {
    const testTwo = await prisma.AllowedEmails.create({
      data: {
        email: newEmail
      },
    })

    // console.log(testTwo);
  } catch (err) {
    throw new Error('Failed to Create');
  }


  revalidatePath('/admin');
}


// remove emails from JSON file
export async function removeAdminServerAction(formData) {

  const emailToRemove = formData.get("email");
  try {
    const deleteUser = await prisma.AllowedEmails.delete({
      where: {
        email: emailToRemove
      },
    })
  } catch (err) {
    throw new Error('Failed to Delete');
  }


  revalidatePath('/admin');

}


