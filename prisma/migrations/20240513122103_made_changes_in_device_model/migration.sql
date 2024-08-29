/*
  Warnings:

  - You are about to drop the column `checkedInAt` on the `device` table. All the data in the column will be lost.
  - You are about to drop the column `checkedOutAt` on the `device` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `device` DROP COLUMN `checkedInAt`,
    DROP COLUMN `checkedOutAt`;
