-- CreateTable
CREATE TABLE `DefectiveDevice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serialnumber` VARCHAR(255) NOT NULL,
    `entryid` INTEGER NULL,
    `sendTrackingId` VARCHAR(255) NULL,
    `receiveTrackingId` VARCHAR(255) NULL,
    `supplierRepairCaseId` VARCHAR(255) NULL,
    `defectReported` TEXT NOT NULL,
    `typeOfRepair` ENUM('IW', 'OOW', 'BOTH', 'OTHER') NULL,
    `dateCourierReceivedAsset` DATETIME(3) NULL,
    `dateWHReceivedAsset` DATETIME(3) NULL,
    `currentLocation` ENUM('Warehouse', 'Courier', 'Supplier') NOT NULL,
    `partsReplaced` TEXT NULL,
    `notes` TEXT NULL,
    `quotationAmount` DOUBLE NULL,
    `repairedBy` ENUM('Supplier', 'OurTeam', 'NotRepaired', 'Other') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deviceId` INTEGER NOT NULL,

    INDEX `DefectiveDevice_deviceId_idx`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
