/*
  Warnings:

  - A unique constraint covering the columns `[serialnumber]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `checkincheckout` ADD COLUMN `rack` VARCHAR(191) NULL,
    ADD COLUMN `shelf` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Device_serialnumber_key` ON `Device`(`serialnumber`);
