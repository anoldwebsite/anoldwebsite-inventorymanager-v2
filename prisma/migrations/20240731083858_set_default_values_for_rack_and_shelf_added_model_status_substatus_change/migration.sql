/*
  Warnings:

  - Made the column `userId` on table `checkincheckout` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `checkincheckout` MODIFY `userId` INTEGER NOT NULL,
    MODIFY `rack` VARCHAR(191) NULL DEFAULT 'NULL_PLACEHOLDER',
    MODIFY `shelf` VARCHAR(191) NULL DEFAULT 'NULL_PLACEHOLDER';

-- AlterTable
ALTER TABLE `device` MODIFY `rack` VARCHAR(191) NULL DEFAULT 'NULL_PLACEHOLDER',
    MODIFY `shelf` VARCHAR(191) NULL DEFAULT 'NULL_PLACEHOLDER';

-- CreateTable
CREATE TABLE `StatusSubstatusChange` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `oldStatus` ENUM('InTransit', 'InStock', 'InUse', 'Missing', 'Retired', 'OnOrder') NULL,
    `newStatus` ENUM('InTransit', 'InStock', 'InUse', 'Missing', 'Retired', 'OnOrder') NOT NULL,
    `oldSubstatus` ENUM('PendingRepair', 'PendingDisposal', 'Reserved', 'Unimaged', 'Available', 'Defective', 'PendingTransfer', 'Deactivated') NULL,
    `newSubstatus` ENUM('PendingRepair', 'PendingDisposal', 'Reserved', 'Unimaged', 'Available', 'Defective', 'PendingTransfer', 'Deactivated') NOT NULL,
    `changedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StatusSubstatusChange_deviceId_idx`(`deviceId`),
    INDEX `StatusSubstatusChange_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
