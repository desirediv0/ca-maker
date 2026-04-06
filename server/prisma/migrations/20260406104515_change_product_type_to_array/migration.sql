/*
  Warnings:

  - The `productType` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'RETURN_APPROVED';
ALTER TYPE "OrderStatus" ADD VALUE 'RETURN_COMPLETED';

-- DropIndex
DROP INDEX "Category_name_key";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "MOQSetting" ALTER COLUMN "isActive" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "awbCode" TEXT,
ADD COLUMN     "codCharge" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "courierName" TEXT,
ADD COLUMN     "shiprocketOrderId" INTEGER,
ADD COLUMN     "shiprocketShipmentId" INTEGER,
ADD COLUMN     "shiprocketStatus" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "flashSaleDiscount" DOUBLE PRECISION,
ADD COLUMN     "flashSaleId" TEXT,
ADD COLUMN     "flashSaleName" TEXT,
ADD COLUMN     "originalPrice" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "PaymentSettings" ADD COLUMN     "codCharge" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "accessDuration" INTEGER,
ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "attempts" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "batchEndDate" TIMESTAMP(3),
ADD COLUMN     "batchStartDate" TIMESTAMP(3),
ADD COLUMN     "bookOptions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "courseTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "courseType" TEXT,
ADD COLUMN     "digitalEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "digitalFile" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "facultyName" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "modes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "sampleBookUrl" TEXT,
ADD COLUMN     "sampleNotes" TEXT,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "studentCapacity" INTEGER,
DROP COLUMN "productType",
ADD COLUMN     "productType" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "shippingBreadth" DOUBLE PRECISION,
ADD COLUMN     "shippingHeight" DOUBLE PRECISION,
ADD COLUMN     "shippingLength" DOUBLE PRECISION,
ADD COLUMN     "shippingWeight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ReturnSettings" ALTER COLUMN "isEnabled" SET DEFAULT false;

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "exam" TEXT,
    "result" TEXT,
    "text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShiprocketSettings" (
    "id" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "password" TEXT,
    "token" TEXT,
    "tokenExpiry" TIMESTAMP(3),
    "defaultLength" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "defaultBreadth" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "defaultHeight" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "defaultWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "shippingCharge" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "freeShippingThreshold" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "ShiprocketSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShiprocketPickupAddress" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL DEFAULT 'Primary Warehouse',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "pincode" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT true,
    "shiprocketPickupId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShiprocketPickupAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Testimonial_isPublished_idx" ON "Testimonial"("isPublished");

-- CreateIndex
CREATE INDEX "Testimonial_order_idx" ON "Testimonial"("order");

-- CreateIndex
CREATE UNIQUE INDEX "ShiprocketSettings_id_key" ON "ShiprocketSettings"("id");

-- CreateIndex
CREATE INDEX "ShiprocketPickupAddress_isDefault_idx" ON "ShiprocketPickupAddress"("isDefault");
