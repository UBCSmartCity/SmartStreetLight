/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `AllowedEmails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AllowedEmails_email_key" ON "AllowedEmails"("email");
