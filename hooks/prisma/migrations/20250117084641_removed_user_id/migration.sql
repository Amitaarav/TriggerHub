/*
  Warnings:

  - You are about to drop the column `userId` on the `Zap` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Zap" DROP CONSTRAINT "Zap_userId_fkey";

-- AlterTable
ALTER TABLE "Zap" DROP COLUMN "userId";
