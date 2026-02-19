-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "geohash" VARCHAR(12);

-- CreateIndex
CREATE INDEX "Media_geohash_idx" ON "Media"("geohash");
