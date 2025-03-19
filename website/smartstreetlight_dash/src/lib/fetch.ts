#!/usr/bin/env node

import prisma from "./prisma";

export default async function fetch() {
  const test = await prisma.streetLightData.findMany();
  console.log(test);
}

fetch();
