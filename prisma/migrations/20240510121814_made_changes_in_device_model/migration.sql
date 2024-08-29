/*
  Warnings:

  - You are about to drop the column `Specifications` on the `device` table. All the data in the column will be lost.
  - You are about to drop the column `Title` on the `device` table. All the data in the column will be lost.
  - Added the required column `title` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Made the column `serialnumber` on table `device` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `device` DROP COLUMN `Specifications`,
    DROP COLUMN `Title`,
    ADD COLUMN `specifications` TEXT NULL,
    ADD COLUMN `title` VARCHAR(255) NOT NULL,
    MODIFY `serialnumber` VARCHAR(255) NOT NULL;
