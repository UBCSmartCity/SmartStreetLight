"use server";
import { revalidatePath } from 'next/cache';

// reverse geocoding
export async function getAddress(lat, long) {
  const t = await fetch(
    `https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=${process.env.MAPKEY}`
  );

  const loc = await t.json();

  return (
    loc.address.building ||
    loc.display_name.split(", ")[0] + " " + loc.display_name.split(", ")[1] ||
    "Location not detected"
  );
}




import fs from "fs/promises";
import path from "path";


const filePath = path.resolve("./src/adminEmails.json");

export async function getEmails() {
  const data = await fs.readFile(filePath, "utf-8");
  console.log('admin email list', data);
  return JSON.parse(data);

}

export async function addAdminServerAction(formData) {
  "use server";
  const newEmail = formData.get("email");
  if (!newEmail) return;

  const emails = await getEmails();
  if (!emails.includes(newEmail)) {
    console.log('add new email', newEmail);
    emails.push(newEmail);
    await fs.writeFile(filePath, JSON.stringify(emails, null, 2));
  }

  revalidatePath('/admin')
}

export async function removeAdminServerAction(formData) {
  "use server";
  const emailToRemove = formData.get("email");
  if (!emailToRemove) return;

  const emails = await getEmails();
  console.log('delete email', emailToRemove);
  const filtered = emails.filter((email) => email !== emailToRemove);
  await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));

  revalidatePath('/admin')

}
