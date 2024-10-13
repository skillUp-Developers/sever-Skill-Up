/*
  Warnings:

  - You are about to drop the column `logo` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `team` table. All the data in the column will be lost.
  - Added the required column `logoUrl` to the `client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MODERATOR';

-- AlterTable
ALTER TABLE "client" DROP COLUMN "logo",
ADD COLUMN     "logoUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "project" DROP COLUMN "photo",
ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "team" DROP COLUMN "photo",
ADD COLUMN     "imageUrl" TEXT NOT NULL;
