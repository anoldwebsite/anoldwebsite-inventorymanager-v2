/*
  Warnings:

  - You are about to drop the column `uniqueRackShelf` on the `rackshelf` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `unique_rack_shelf` ON `rackshelf`;

-- AlterTable
ALTER TABLE `rackshelf` DROP COLUMN `uniqueRackShelf`;
