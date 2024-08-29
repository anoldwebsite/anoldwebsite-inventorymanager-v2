/*
  Warnings:

  - Added the required column `createdByUserId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `createdByUserId` INTEGER NOT NULL;
