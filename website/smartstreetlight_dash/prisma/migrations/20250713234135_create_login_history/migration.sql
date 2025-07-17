-- CreateTable
CREATE TABLE "login_history" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "loginTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,

    CONSTRAINT "login_history_pkey" PRIMARY KEY ("id")
);
