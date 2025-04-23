"use server";
import { revalidatePath } from 'next/cache';
import useSWR from 'swr';
import fs from "fs/promises";
import path from "path";
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


// temporary JSON file to store authorized emails (convert to a proper database later)
const filePath = path.resolve("./src/adminEmails.json");


// retrieve emails from JSON file
export async function getEmails() {
  // const data = await fs.readFile(filePath, "utf-8");
  // console.log('admin email list', data);
  // return JSON.parse(data);

  const data = await prisma.AllowedEmails.findMany({
    select: {
      email: true
    }
  });
  return data;



}


// add emails to JSON file
export async function addAdminServerAction(formData) {
  // "use server";
  // const newEmail = formData.get("email");
  // if (!newEmail) return;

  // const emails = await getEmails();
  // if (!emails.includes(newEmail)) {
  //   console.log('add new email', newEmail);
  //   emails.push(newEmail);
  //   await fs.writeFile(filePath, JSON.stringify(emails, null, 2));
  // }

  const newEmail = formData.get("email");

  const testTwo = await prisma.AllowedEmails.create({
    data: {
      email: newEmail
    },
  })

  revalidatePath('/admin');
}


// remove emails from JSON file
export async function removeAdminServerAction(formData) {
  // "use server";
  // const emailToRemove = formData.get("email");
  // if (!emailToRemove) return;

  // const emails = await getEmails();
  // console.log('delete email', emailToRemove);
  // const filtered = emails.filter((email) => email !== emailToRemove);
  // await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));


  const emailToRemove = formData.get("email");

  const deleteUser = await prisma.AllowedEmails.delete({
    where: {
      email: emailToRemove
    },
  })


  revalidatePath('/admin');

}
