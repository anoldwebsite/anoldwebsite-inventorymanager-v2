/*
  Warnings:

  - A unique constraint covering the columns `[country,project,rack,shelf]` on the table `RackShelf` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `RackShelf_country_project_rack_shelf_key` ON `RackShelf`(`country`, `project`, `rack`, `shelf`);
