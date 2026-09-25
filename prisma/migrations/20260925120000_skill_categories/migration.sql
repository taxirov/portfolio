-- CreateTable
CREATE TABLE "SkillCategory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SkillCategory_sortOrder_idx" ON "SkillCategory"("sortOrder");

-- Carry over the groups that used to be hard-coded in lib/skills.ts; their keys become the ids,
-- so existing Skill.category values point at the right row.
INSERT INTO "SkillCategory" ("id", "title", "icon", "sortOrder", "updatedAt") VALUES
    ('languages', 'Programming languages', 'bi-translate', 1, CURRENT_TIMESTAMP),
    ('backend', 'Backend', 'bi-hdd-stack', 2, CURRENT_TIMESTAMP),
    ('frontend', 'Frontend', 'bi-window', 3, CURRENT_TIMESTAMP),
    ('tools', 'Tools', 'bi-wrench-adjustable-circle', 4, CURRENT_TIMESTAMP),
    ('infrastructure', 'Infrastructure', 'bi-cloud', 5, CURRENT_TIMESTAMP),
    ('learning', 'Learning now', 'bi-broadcast', 6, CURRENT_TIMESTAMP);

-- Any other value would break the foreign key; park it in "tools".
UPDATE "Skill" SET "category" = 'tools' WHERE "category" NOT IN (SELECT "id" FROM "SkillCategory");

-- AlterTable
DROP INDEX "Skill_published_category_sortOrder_idx";
ALTER TABLE "Skill" RENAME COLUMN "category" TO "categoryId";

-- CreateIndex
CREATE INDEX "Skill_categoryId_sortOrder_idx" ON "Skill"("categoryId", "sortOrder");

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "SkillCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
