"use server";

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

// reverse geocoding using GeoNames API (10'000 credits, 1 credit per request)
// export async function getAddress(lat, long) {
//   const t = await fetch(
//     `http://api.geonames.org/findNearestIntersectionOSMJSON?lat=${lat}&lng=${long}&username=${process.env.GEOUSER}`
//   );

//   const loc = await t.json();

//   console.log("loc", loc);
//   return loc.intersection.street1 + " and " + loc.intersection.street2;
// }
