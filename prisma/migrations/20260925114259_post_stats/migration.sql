-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "shares" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "PostEvent" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostEvent_createdAt_idx" ON "PostEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PostEvent_postId_kind_ipHash_day_key" ON "PostEvent"("postId", "kind", "ipHash", "day");

-- AddForeignKey
ALTER TABLE "PostEvent" ADD CONSTRAINT "PostEvent_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
