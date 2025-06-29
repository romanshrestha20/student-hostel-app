/*
  Warnings:

  - The values [Male,Female,Unisex] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('male', 'female', 'unisex');
ALTER TABLE "Hostel" ALTER COLUMN "gender" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TABLE "Hostel" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "Gender_old";
ALTER TABLE "Hostel" ALTER COLUMN "gender" SET DEFAULT 'unisex';
COMMIT;

-- AlterTable
ALTER TABLE "Hostel" ALTER COLUMN "gender" SET DEFAULT 'unisex';
