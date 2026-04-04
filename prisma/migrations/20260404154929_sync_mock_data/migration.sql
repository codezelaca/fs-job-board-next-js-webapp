/*
  Warnings:

  - You are about to drop the column `description` on the `Job` table. All the data in the column will be lost.
  - The `requirements` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `about` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "description",
ADD COLUMN     "about" TEXT NOT NULL,
ADD COLUMN     "responsibilities" TEXT[],
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "term" TEXT NOT NULL,
DROP COLUMN "requirements",
ADD COLUMN     "requirements" TEXT[];
