/*
  Warnings:

  - A unique constraint covering the columns `[model]` on the table `starships` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cargoCapacity` to the `starships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hyperdriveRating` to the `starships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `starships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxSpeed` to the `starships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `starships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `starshipClass` to the `starships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `starships` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StarshipClass" AS ENUM ('FIGHTER', 'TRANSPORTER', 'SPEEDER');

-- AlterTable
ALTER TABLE "starships" ADD COLUMN     "cargoCapacity" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hyperdriveRating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "length" INTEGER NOT NULL,
ADD COLUMN     "maxSpeed" INTEGER NOT NULL,
ADD COLUMN     "model" TEXT NOT NULL,
ADD COLUMN     "starshipClass" "StarshipClass" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "starships_model_key" ON "starships"("model");
