/*
  Warnings:

  - The values [LAPTOP,DESKTOP,DESKTOPMINI,MONITOR,MONITORWITHDOCK,CONFERENCEMONITOR,DOCKSTATION,OTHER] on the enum `Device_modelCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [Intransit,Instock,Inuse] on the enum `Device_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [Pendingrepair,Pendingdisposal,Pendingtransfer] on the enum `Device_substatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `device` MODIFY `modelCategory` ENUM('Laptop', 'Desktop', 'DesktopMini', 'StandardMonitor', 'MonitorWithDock', 'ConferenceMonitor', 'Dockstation', 'Other') NOT NULL,
    MODIFY `status` ENUM('InTransit', 'InStock', 'InUse', 'Missing', 'Retired', 'OnOrder') NOT NULL,
    MODIFY `substatus` ENUM('PendingRepair', 'PendingDisposal', 'Reserved', 'Unimaged', 'Available', 'Defective', 'PendingTransfer', 'Deactivated') NOT NULL;
