-- CreateTable
CREATE TABLE "DailyAnalytics" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyAnalytics_portfolioId_idx" ON "DailyAnalytics"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyAnalytics_portfolioId_date_key" ON "DailyAnalytics"("portfolioId", "date");

-- AddForeignKey
ALTER TABLE "DailyAnalytics" ADD CONSTRAINT "DailyAnalytics_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
