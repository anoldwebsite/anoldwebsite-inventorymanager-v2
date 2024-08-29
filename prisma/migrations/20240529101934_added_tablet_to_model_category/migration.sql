-- AlterTable
ALTER TABLE `device` MODIFY `modelCategory` ENUM('Laptop', 'Desktop', 'DesktopMini', 'StandardMonitor', 'MonitorWithDock', 'ConferenceMonitor', 'Dockstation', 'Tablet', 'Other') NOT NULL;
