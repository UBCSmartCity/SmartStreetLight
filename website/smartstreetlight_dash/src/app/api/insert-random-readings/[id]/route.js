import prisma from '@/lib/prisma';

function randomWithSmallRange(base, variance) {
    // Always within base ± variance, rounded to 1 decimal
    const value = base + (Math.random() - 0.5) * variance * 2;
    return Math.round(value * 10) / 10;
}

// demonstrate continuous data insertions 
export async function GET(request, { params }) {
    const { id } = await params;
    const interval = 5000; // 5 seconds
    let count = 0;
    const maxCount = 12; // Prevent infinite loop in serverless (1 minute)

    async function insertOnce() {
        const now = new Date();
        const reading = {
            energy_usage: randomWithSmallRange(10, 0.5), // 9.5 - 10.5
            brightness_level: randomWithSmallRange(80, 2), // 78 - 82
            reading_time: now,
            light_status: Math.random() > 0.1 ? 'ON' : 'OFF',
            power_consumption: randomWithSmallRange(50, 2), // 48 - 52
            battery_status: randomWithSmallRange(95, 1), // 94 - 96
            sensor_health: Math.random() > 0.05 ? 'OK' : 'FAULTY',
            light_id: parseInt(id),
        };
        await prisma.streetlightReading.create({ data: reading });
    }

    // Insert every 5 seconds, up to maxCount
    while (count < maxCount) {
        await insertOnce();
        count++;
        if (count < maxCount) {
            await new Promise(res => setTimeout(res, interval));
        }
    }

    return Response.json({ success: true, inserted: count });
}
