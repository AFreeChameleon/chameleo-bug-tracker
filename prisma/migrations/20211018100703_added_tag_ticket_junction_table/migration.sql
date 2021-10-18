/*
  Warnings:

  - You are about to drop the column `ticketId` on the `Tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_ticketId_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "ticketId";

-- CreateTable
CREATE TABLE "TagTicketJunction" (
    "id" SERIAL NOT NULL,
    "tagId" INTEGER NOT NULL,
    "ticketId" INTEGER NOT NULL,

    CONSTRAINT "TagTicketJunction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TagTicketJunction" ADD CONSTRAINT "TagTicketJunction_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagTicketJunction" ADD CONSTRAINT "TagTicketJunction_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
