/*
  Warnings:

  - A unique constraint covering the columns `[model]` on the table `starships` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "StarshipClass" AS ENUM ('FIGHTER', 'TRANSPORTER', 'SPEEDER');

-- AlterTable
ALTER TABLE "starships" ADD COLUMN     "cargoCapacity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hyperdriveRating" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
ADD COLUMN     "length" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxSpeed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "model" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "starshipClass" "StarshipClass" NOT NULL DEFAULT 'FIGHTER',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "crewMembers" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "starships_model_key" ON "starships"("model");
