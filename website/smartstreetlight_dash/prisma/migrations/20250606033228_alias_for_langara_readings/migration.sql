/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdminEmails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AllowedEmails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Authenticator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BigWayData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LangaraData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MoreData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MoreData2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Authenticator" DROP CONSTRAINT "Authenticator_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "AdminEmails";

-- DropTable
DROP TABLE "AllowedEmails";

-- DropTable
DROP TABLE "Authenticator";

-- DropTable
DROP TABLE "BigWayData";

-- DropTable
DROP TABLE "LangaraData";

-- DropTable
DROP TABLE "MoreData";

-- DropTable
DROP TABLE "MoreData2";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "bigway_readings" (
    "id" INTEGER,
    "sensor_id" VARCHAR(50),
    "energy_usage" DOUBLE PRECISION,
    "brightness_level" DOUBLE PRECISION,
    "reading_time" TIMESTAMP(6),
    "light_status" VARCHAR(10),
    "power_consumption" DOUBLE PRECISION,
    "battery_status" DOUBLE PRECISION,
    "sensor_health" VARCHAR(20),
    "location" VARCHAR(100)
);

-- CreateTable
CREATE TABLE "LangaraReadings" (
    "id" SERIAL NOT NULL,
    "sensor_id" VARCHAR(50) NOT NULL,
    "energy_usage" DOUBLE PRECISION,
    "brightness_level" DOUBLE PRECISION,
    "reading_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "light_status" VARCHAR(10) DEFAULT 'OFF',
    "power_consumption" DOUBLE PRECISION,
    "battery_status" DOUBLE PRECISION,
    "sensor_health" VARCHAR(20),

    CONSTRAINT "sensor_readings_pkey" PRIMARY KEY ("id")
);
