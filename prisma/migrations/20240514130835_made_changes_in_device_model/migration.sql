/*
  Warnings:

  - Made the column `inOutStatus` on table `device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `specifications` on table `device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `leaseEndDate` on table `device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modelCategory` on table `device` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `device` MODIFY `inOutStatus` ENUM('CHECKEDIN', 'CHECKEDOUT') NOT NULL,
    MODIFY `specifications` TEXT NOT NULL,
    MODIFY `leaseEndDate` DATETIME(3) NOT NULL,
    MODIFY `modelCategory` ENUM('LAPTOP', 'DESKTOP', 'DESKTOPMINI', 'MONITOR', 'MONITORWITHDOCK', 'CONFERENCEMONITOR', 'DOCKSTATION', 'OTHER') NOT NULL;
