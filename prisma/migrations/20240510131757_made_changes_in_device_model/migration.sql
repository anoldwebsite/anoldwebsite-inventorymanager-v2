/*
  Warnings:

  - You are about to drop the column `assigned_to_user_idx` on the `device` table. All the data in the column will be lost.
  - You are about to drop the column `model_category_idx` on the `device` table. All the data in the column will be lost.
  - You are about to drop the column `assigned_to_user_idx` on the `ticket` table. All the data in the column will be lost.
  - You are about to drop the column `assignment_group_idx` on the `ticket` table. All the data in the column will be lost.
  - You are about to drop the column `task_category_idx` on the `ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `device` DROP COLUMN `assigned_to_user_idx`,
    DROP COLUMN `model_category_idx`,
    ADD COLUMN `assignedToUserId` INTEGER NULL,
    ADD COLUMN `modelCategory` ENUM('LAPTOP', 'DEKSTOP', 'DEKTOPMINI', 'MONITOR', 'MONITORWITHDOCK', 'CONFERENCEMONITOR', 'DOCKSTATION', 'OTHER') NULL;

-- AlterTable
ALTER TABLE `ticket` DROP COLUMN `assigned_to_user_idx`,
    DROP COLUMN `assignment_group_idx`,
    DROP COLUMN `task_category_idx`,
    ADD COLUMN `assignedToUserId` INTEGER NULL,
    ADD COLUMN `assignmentgroup` ENUM('WAREHOUSE', 'HUB', 'DISPATCH', 'CONSULTANT', 'OTHER') NULL,
    ADD COLUMN `taskCategory` ENUM('IMAGING', 'INSTALLATION', 'DEINSTALLATION', 'DISKKILL', 'CHECKIN', 'CHECKOUT', 'REFURBISHMENT', 'PALLET', 'OTHER') NULL;
