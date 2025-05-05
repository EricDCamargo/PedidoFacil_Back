/*
  Warnings:

  - Added the required column `total_value` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_value` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_table_id_fkey";

-- AlterTable
ALTER TABLE "items" ADD COLUMN     "observation" TEXT,
ADD COLUMN     "total_value" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unit_value" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "troco" DOUBLE PRECISION,
ALTER COLUMN "table_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "payment_orders" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_orders_payment_id_order_id_key" ON "payment_orders"("payment_id", "order_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
