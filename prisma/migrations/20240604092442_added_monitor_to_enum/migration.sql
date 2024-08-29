-- AlterTable
ALTER TABLE `checkincheckout` MODIFY `action` ENUM('CHECKIN', 'CHECKOUT', 'RELOCATION', 'MOVING') NOT NULL;

-- AlterTable
ALTER TABLE `device` MODIFY `modelCategory` ENUM('Laptop', 'Desktop', 'DesktopMini', 'StandardMonitor', 'Monitor', 'MonitorWithDock', 'ConferenceMonitor', 'Dockstation', 'Tablet', 'Other') NOT NULL;
