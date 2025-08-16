/*
  Warnings:

  - You are about to drop the column `endereco` on the `Animal` table. All the data in the column will be lost.
  - Added the required column `cidade` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "tipoCidade" AS ENUM ('PELOTAS');

-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "endereco",
ADD COLUMN     "cidade" "tipoCidade" NOT NULL;
