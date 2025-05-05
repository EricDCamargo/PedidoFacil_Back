/*
  Warnings:

  - Made the column `table_id` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_table_id_fkey";

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "table_id" SET NOT NULL;
