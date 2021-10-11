/*
  Warnings:

  - A unique constraint covering the columns `[company]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `company` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "company" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "assignedUserId" DROP NOT NULL,
ALTER COLUMN "source" SET DEFAULT E'website',
ALTER COLUMN "started" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_company_key" ON "Project"("company");
