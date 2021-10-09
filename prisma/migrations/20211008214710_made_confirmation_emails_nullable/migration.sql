-- AlterTable
ALTER TABLE "User" ALTER COLUMN "confirmationEmailSent" DROP NOT NULL,
ALTER COLUMN "confirmedAt" DROP NOT NULL;
