-- CreateTable
CREATE TABLE "AllowedEmails" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "AllowedEmails_pkey" PRIMARY KEY ("id")
);
