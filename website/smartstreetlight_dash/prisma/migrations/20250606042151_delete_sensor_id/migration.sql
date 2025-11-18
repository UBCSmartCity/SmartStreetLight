/*
  Warnings:

  - You are about to drop the `LangaraReadings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "LangaraReadings";

-- CreateTable
CREATE TABLE "langara_readings" (
    "id" SERIAL NOT NULL,
    "energy_usage" DOUBLE PRECISION,
    "brightness_level" DOUBLE PRECISION,
    "reading_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "light_status" VARCHAR(10) DEFAULT 'OFF',
    "power_consumption" DOUBLE PRECISION,
    "battery_status" DOUBLE PRECISION,
    "sensor_health" VARCHAR(20),

    CONSTRAINT "sensor_readings_pkey" PRIMARY KEY ("id")
);
