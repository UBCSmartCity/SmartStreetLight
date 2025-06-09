/*
  Warnings:

  - You are about to drop the `EngineerEmails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "EngineerEmails";

-- CreateTable
CREATE TABLE "engineer_emails" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "engineer_emails_pkey" PRIMARY KEY ("id")
);
