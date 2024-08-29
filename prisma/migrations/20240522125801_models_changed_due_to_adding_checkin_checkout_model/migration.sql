/*
  Warnings:

  - Added the required column `status` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `substatus` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `device` ADD COLUMN `rack` VARCHAR(191) NULL,
    ADD COLUMN `shelf` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('Intransit', 'Instock', 'Inuse', 'Missing', 'Retired', 'OnOrder') NOT NULL,
    ADD COLUMN `substatus` ENUM('Pendingrepair', 'Pendingdisposal', 'Reserved', 'Unimaged', 'Available', 'Defective', 'Pendingtransfer', 'Deactivated') NOT NULL;

-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `deviceId` INTEGER NULL;

-- CreateTable
CREATE TABLE `CheckinCheckout` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `ticketId` INTEGER NULL,
    `action` ENUM('CHECKEDIN', 'CHECKEDOUT') NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CheckinCheckout_deviceId_idx`(`deviceId`),
    INDEX `CheckinCheckout_userId_idx`(`userId`),
    INDEX `CheckinCheckout_ticketId_idx`(`ticketId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Device_assignedToUserId_idx` ON `Device`(`assignedToUserId`);

-- CreateIndex
CREATE INDEX `Ticket_assignedToUserId_idx` ON `Ticket`(`assignedToUserId`);

-- CreateIndex
CREATE INDEX `Ticket_deviceId_idx` ON `Ticket`(`deviceId`);
