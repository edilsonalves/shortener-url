-- CreateTable
CREATE TABLE "shorten_url_clicks" (
    "id" TEXT NOT NULL,
    "shorten_url_id" TEXT NOT NULL,
    "referrer" TEXT,
    "user_agent" TEXT,
    "ip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shorten_url_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shorten_url_clicks_shorten_url_id_idx" ON "shorten_url_clicks"("shorten_url_id");

-- AddForeignKey
ALTER TABLE "shorten_url_clicks" ADD CONSTRAINT "shorten_url_clicks_shorten_url_id_fkey" FOREIGN KEY ("shorten_url_id") REFERENCES "shorten_urls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
