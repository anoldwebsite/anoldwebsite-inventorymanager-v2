/*
  Warnings:

  - You are about to drop the column `assignedToUserId` on the `ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ticket` DROP COLUMN `assignedToUserId`,
    ADD COLUMN `assigned_to_user_idx` INTEGER NULL,
    ADD COLUMN `assignment_group_idx` ENUM('WAREHOUSE', 'HUB', 'DISPATCH', 'CONSULTANT', 'OTHER') NULL,
    ADD COLUMN `dueDate` DATETIME(3) NULL,
    ADD COLUMN `task_category_idx` ENUM('IMAGING', 'INSTALLATION', 'DEINSTALLATION', 'DISKKILL', 'CHECKIN', 'CHECKOUT', 'REFURBISHMENT', 'PALLET', 'OTHER') NULL,
    MODIFY `status` ENUM('OPEN', 'STARTED', 'CLOSED', 'PENDING', 'CANCELLED') NOT NULL DEFAULT 'OPEN';

-- CreateTable
CREATE TABLE `Device` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serialnumber` VARCHAR(255) NULL,
    `checkedInAt` DATETIME(3) NULL,
    `checkedOutAt` DATETIME(3) NULL,
    `inOutStatus` ENUM('CHECKEDIN', 'CHECKEDOUT') NOT NULL,
    `model_category_idx` ENUM('LAPTOP', 'DEKSTOP', 'DEKTOPMINI', 'MONITOR', 'MONITORWITHDOCK', 'CONFERENCEMONITOR', 'DOCKSTATION', 'OTHER') NULL,
    `assigned_to_user_idx` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
