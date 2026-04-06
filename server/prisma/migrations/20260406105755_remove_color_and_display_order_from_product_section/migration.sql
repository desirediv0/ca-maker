/*
  Warnings:

  - You are about to drop the column `color` on the `ProductSection` table. All the data in the column will be lost.
  - You are about to drop the column `displayOrder` on the `ProductSection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductSection" DROP COLUMN "color",
DROP COLUMN "displayOrder";
