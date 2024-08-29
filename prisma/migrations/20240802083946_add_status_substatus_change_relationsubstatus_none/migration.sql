-- AlterTable
ALTER TABLE `device` MODIFY `substatus` ENUM('PendingRepair', 'PendingDisposal', 'Reserved', 'Unimaged', 'Available', 'Defective', 'PendingTransfer', 'Deactivated', 'None') NOT NULL;

-- AlterTable
ALTER TABLE `statussubstatuschange` MODIFY `oldSubstatus` ENUM('PendingRepair', 'PendingDisposal', 'Reserved', 'Unimaged', 'Available', 'Defective', 'PendingTransfer', 'Deactivated', 'None') NULL,
    MODIFY `newSubstatus` ENUM('PendingRepair', 'PendingDisposal', 'Reserved', 'Unimaged', 'Available', 'Defective', 'PendingTransfer', 'Deactivated', 'None') NOT NULL;
