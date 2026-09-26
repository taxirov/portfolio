-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "currency" TEXT,
ADD COLUMN     "domain" TEXT,
ADD COLUMN     "offer" INTEGER;

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "descriptionUz" TEXT,
    "descriptionRu" TEXT,
    "descriptionEn" TEXT,
    "sold" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Domain_name_key" ON "Domain"("name");

-- CreateIndex
CREATE INDEX "Domain_published_sortOrder_idx" ON "Domain"("published", "sortOrder");
