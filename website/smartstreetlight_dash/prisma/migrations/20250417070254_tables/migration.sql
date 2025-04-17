-- CreateTable
CREATE TABLE "MoreData" (
    "id" SERIAL NOT NULL,
    "reading_time" TIMESTAMP(3) NOT NULL,
    "energy_usage" INTEGER NOT NULL,
    "light_status" TEXT NOT NULL,
    "brightness_level" INTEGER NOT NULL,
    "power_consumption" INTEGER NOT NULL,
    "battery_status" INTEGER NOT NULL,
    "sensor_health" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "MoreData_pkey" PRIMARY KEY ("id")
);
