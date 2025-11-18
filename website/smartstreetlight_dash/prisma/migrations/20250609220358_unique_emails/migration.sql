/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `engineer_emails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "engineer_emails_email_key" ON "engineer_emails"("email");
