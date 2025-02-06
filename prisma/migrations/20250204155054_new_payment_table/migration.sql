/*
  Warnings:

  - You are about to drop the column `order_id` on the `payments` table. All the data in the column will be lost.
  - Added the required column `table_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_order_id_fkey";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "order_id",
ADD COLUMN     "table_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
