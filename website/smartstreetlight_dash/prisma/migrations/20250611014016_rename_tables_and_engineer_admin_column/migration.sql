/*
  Warnings:

  - You are about to drop the `engineer_emails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `streetlight_readings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "streetlight_readings" DROP CONSTRAINT "streetlight_readings_light_id_fkey";

-- DropTable
DROP TABLE "engineer_emails";

-- DropTable
DROP TABLE "streetlight_readings";

-- CreateTable
CREATE TABLE "streetlight_reading" (
    "id" TEXT NOT NULL,
    "energy_usage" DOUBLE PRECISION,
    "brightness_level" DOUBLE PRECISION,
    "reading_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "light_status" VARCHAR(10) DEFAULT 'OFF',
    "power_consumption" DOUBLE PRECISION,
    "battery_status" DOUBLE PRECISION,
    "sensor_health" VARCHAR(20),
    "light_id" INTEGER NOT NULL,

    CONSTRAINT "streetlight_reading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engineer_email" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "engineer_email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "engineer_email_email_key" ON "engineer_email"("email");

-- AddForeignKey
ALTER TABLE "streetlight_reading" ADD CONSTRAINT "streetlight_reading_light_id_fkey" FOREIGN KEY ("light_id") REFERENCES "streetlight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
