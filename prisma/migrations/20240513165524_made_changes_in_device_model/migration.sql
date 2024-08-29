/*
  Warnings:

  - The values [DEKSTOP,DEKTOPMINI] on the enum `Device_modelCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `device` MODIFY `modelCategory` ENUM('LAPTOP', 'DESKTOP', 'DESKTOPMINI', 'MONITOR', 'MONITORWITHDOCK', 'CONFERENCEMONITOR', 'DOCKSTATION', 'OTHER') NULL;
