-- CreateTable Race
CREATE TABLE "Race" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "kindId" TEXT NOT NULL,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for Race unique constraint
CREATE UNIQUE INDEX "Race_name_kindId_key" ON "Race"("name", "kindId");

-- AddForeignKey for Race.kindId
ALTER TABLE "Race" ADD CONSTRAINT "Race_kindId_fkey" FOREIGN KEY ("kindId") REFERENCES "Kind"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable Pet to add raceId
ALTER TABLE "Pet" ADD COLUMN "raceId" TEXT;

-- AddForeignKey for Pet.race
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE SET NULL ON UPDATE CASCADE;
