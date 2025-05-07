-- CreateTable
CREATE TABLE "AdminEmails" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "AdminEmails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminEmails_email_key" ON "AdminEmails"("email");
