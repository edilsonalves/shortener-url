-- CreateTable
CREATE TABLE "shorten_urls" (
    "id" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "short_code" TEXT NOT NULL,
    "short_url" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shorten_urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shorten_urls_short_code_key" ON "shorten_urls"("short_code");

-- CreateIndex
CREATE UNIQUE INDEX "shorten_urls_short_url_key" ON "shorten_urls"("short_url");

-- CreateIndex
CREATE INDEX "shorten_urls_original_url_idx" ON "shorten_urls"("original_url");
