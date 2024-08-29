/*
  Warnings:

  - The values [CHECKEDIN,CHECKEDOUT] on the enum `CheckinCheckout_action` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `checkincheckout` MODIFY `action` ENUM('CHECKIN', 'CHECKOUT', 'RELOCATION') NOT NULL;
