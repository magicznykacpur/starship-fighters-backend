-- CreateTable
CREATE TABLE "starships" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "crewMembers" INTEGER NOT NULL,

    CONSTRAINT "starships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mass" INTEGER NOT NULL,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "starships_name_key" ON "starships"("name");

-- CreateIndex
CREATE UNIQUE INDEX "people_name_key" ON "people"("name");
