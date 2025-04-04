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



export async function getEmails() {

  return ['test@gmail.com', 'test2@gmail.com'];
}



export async function addAdminServerAction(formData) {
  const email = formData.get('email');
  if (!email) return;

  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/manage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  revalidatePath('/admin');
}

export async function removeAdminServerAction(formData) {
  const email = formData.get('email');
  if (!email) return;

  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/manage`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  revalidatePath('/admin');
}