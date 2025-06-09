/*
  Warnings:

  - You are about to drop the `bigway_readings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `langara_readings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "bigway_readings";

-- DropTable
DROP TABLE "langara_readings";

-- CreateTable
CREATE TABLE "streetlight_readings" (
    "id" TEXT NOT NULL,
    "energy_usage" DOUBLE PRECISION,
    "brightness_level" DOUBLE PRECISION,
    "reading_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "light_status" VARCHAR(10) DEFAULT 'OFF',
    "power_consumption" DOUBLE PRECISION,
    "battery_status" DOUBLE PRECISION,
    "sensor_health" VARCHAR(20),
    "light_id" INTEGER NOT NULL,

    CONSTRAINT "streetlight_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "streetlight" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "start_date" TIMESTAMP(3),

    CONSTRAINT "streetlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngineerEmails" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "EngineerEmails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "streetlight_readings" ADD CONSTRAINT "streetlight_readings_light_id_fkey" FOREIGN KEY ("light_id") REFERENCES "streetlight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
