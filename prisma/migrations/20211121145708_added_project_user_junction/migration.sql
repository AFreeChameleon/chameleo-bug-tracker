-- CreateTable
CREATE TABLE "ProjectUserJunction" (
    "id" SERIAL NOT NULL,
    "projectId" UUID NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ProjectUserJunction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectUserJunction" ADD CONSTRAINT "ProjectUserJunction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUserJunction" ADD CONSTRAINT "ProjectUserJunction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
