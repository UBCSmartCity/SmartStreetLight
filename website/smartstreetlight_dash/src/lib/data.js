
'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

export async function getAddress(lat, long) {

    const t = await fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=${process.env.MAPKEY}`);

      const loc = await t.json();



    return  loc.address.building || loc.display_name.split(", ")[0] + " " +
            loc.display_name.split(", ")[1] || "Location not detected";
           
}
