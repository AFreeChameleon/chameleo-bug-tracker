/*
  Warnings:

  - You are about to drop the `ProjectUserJunction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectUserJunction" DROP CONSTRAINT "ProjectUserJunction_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectUserJunction" DROP CONSTRAINT "ProjectUserJunction_userId_fkey";

-- DropTable
DROP TABLE "ProjectUserJunction";

-- CreateTable
CREATE TABLE "project_user_junctions" (
    "id" SERIAL NOT NULL,
    "projectId" UUID NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "project_user_junctions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "project_user_junctions" ADD CONSTRAINT "project_user_junctions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_user_junctions" ADD CONSTRAINT "project_user_junctions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
