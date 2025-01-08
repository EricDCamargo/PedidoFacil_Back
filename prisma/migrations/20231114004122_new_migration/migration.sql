/*
  Warnings:

  - You are about to drop the column `name` on the `items` table. All the data in the column will be lost.
  - Added the required column `amount` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "items" DROP COLUMN "name",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
