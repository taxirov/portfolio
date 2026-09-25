-- Translated fields get one column per language. Existing content was written in English,
-- so the current columns become the *En columns and nothing is lost.

-- Project
ALTER TABLE "Project" RENAME COLUMN "title" TO "titleEn";
ALTER TABLE "Project" RENAME COLUMN "description" TO "descriptionEn";
ALTER TABLE "Project" RENAME COLUMN "note" TO "noteEn";
ALTER TABLE "Project" ALTER COLUMN "titleEn" DROP NOT NULL,
    ALTER COLUMN "descriptionEn" DROP NOT NULL,
    ADD COLUMN "titleUz" TEXT,
    ADD COLUMN "titleRu" TEXT,
    ADD COLUMN "descriptionUz" TEXT,
    ADD COLUMN "descriptionRu" TEXT,
    ADD COLUMN "noteUz" TEXT,
    ADD COLUMN "noteRu" TEXT;

-- Post
ALTER TABLE "Post" RENAME COLUMN "title" TO "titleEn";
ALTER TABLE "Post" RENAME COLUMN "excerpt" TO "excerptEn";
ALTER TABLE "Post" RENAME COLUMN "content" TO "contentEn";
ALTER TABLE "Post" ALTER COLUMN "titleEn" DROP NOT NULL,
    ALTER COLUMN "contentEn" DROP NOT NULL,
    ADD COLUMN "titleUz" TEXT,
    ADD COLUMN "titleRu" TEXT,
    ADD COLUMN "excerptUz" TEXT,
    ADD COLUMN "excerptRu" TEXT,
    ADD COLUMN "contentUz" TEXT,
    ADD COLUMN "contentRu" TEXT;

-- SkillCategory
ALTER TABLE "SkillCategory" RENAME COLUMN "title" TO "titleEn";
ALTER TABLE "SkillCategory" ALTER COLUMN "titleEn" DROP NOT NULL,
    ADD COLUMN "titleUz" TEXT,
    ADD COLUMN "titleRu" TEXT;

-- The built-in skill groups get their Uzbek and Russian names.
UPDATE "SkillCategory" SET "titleUz" = 'Dasturlash tillari', "titleRu" = 'Языки программирования' WHERE "id" = 'languages';
UPDATE "SkillCategory" SET "titleUz" = 'Backend', "titleRu" = 'Бэкенд' WHERE "id" = 'backend';
UPDATE "SkillCategory" SET "titleUz" = 'Frontend', "titleRu" = 'Фронтенд' WHERE "id" = 'frontend';
UPDATE "SkillCategory" SET "titleUz" = 'Vositalar', "titleRu" = 'Инструменты' WHERE "id" = 'tools';
UPDATE "SkillCategory" SET "titleUz" = 'Infratuzilma', "titleRu" = 'Инфраструктура' WHERE "id" = 'infrastructure';
UPDATE "SkillCategory" SET "titleUz" = 'Hozir o''rganyapman', "titleRu" = 'Изучаю сейчас' WHERE "id" = 'learning';
