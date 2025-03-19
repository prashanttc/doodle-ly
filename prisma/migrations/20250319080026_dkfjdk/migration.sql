/*
  Warnings:

  - You are about to drop the `Creations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Creations" DROP CONSTRAINT "Creations_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 20;

-- DropTable
DROP TABLE "Creations";
