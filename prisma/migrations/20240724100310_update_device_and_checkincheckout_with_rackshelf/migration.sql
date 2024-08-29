-- AlterTable
ALTER TABLE `checkincheckout` ADD COLUMN `rackShelfId` INTEGER NULL;

-- AlterTable
ALTER TABLE `device` ADD COLUMN `rackShelfId` INTEGER NULL;

-- CreateTable
CREATE TABLE `RackShelf` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `country` VARCHAR(2) NOT NULL,
    `project` VARCHAR(255) NOT NULL,
    `rack` VARCHAR(255) NOT NULL,
    `shelf` VARCHAR(255) NOT NULL,
    `uniqueRackShelf` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `unique_rack_shelf`(`uniqueRackShelf`),
    INDEX `idx_rack_shelf`(`country`, `project`, `rack`, `shelf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `CheckinCheckout_rackShelfId_idx` ON `CheckinCheckout`(`rackShelfId`);

-- CreateIndex
CREATE INDEX `Device_rackShelfId_idx` ON `Device`(`rackShelfId`);
