
'use server'


export async function getAddress(lat, long) {

    const t = await fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=${process.env.MAPKEY}`);

      const loc = await t.json();



    return  loc.address.building || loc.display_name.split(", ")[0] + " " +
            loc.display_name.split(", ")[1] || "Location not detected";
           
}
