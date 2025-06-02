-- CreateTable
CREATE TABLE "LangaraData" (
    "id" SERIAL NOT NULL,
    "reading_time" TIMESTAMP(3) NOT NULL,
    "energy_usage" INTEGER NOT NULL,
    "light_status" TEXT NOT NULL,
    "brightness_level" INTEGER NOT NULL,
    "power_consumption" INTEGER NOT NULL,
    "battery_status" INTEGER NOT NULL,
    "sensor_health" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "LangaraData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BigWayData" (
    "id" SERIAL NOT NULL,
    "reading_time" TIMESTAMP(3) NOT NULL,
    "energy_usage" INTEGER NOT NULL,
    "light_status" TEXT NOT NULL,
    "brightness_level" INTEGER NOT NULL,
    "power_consumption" INTEGER NOT NULL,
    "battery_status" INTEGER NOT NULL,
    "sensor_health" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "BigWayData_pkey" PRIMARY KEY ("id")
);

