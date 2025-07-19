-- CreateTable
CREATE TABLE "TradeIdeaLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tradeIdeaId" INTEGER NOT NULL,

    CONSTRAINT "TradeIdeaLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TradeIdeaLike_userId_tradeIdeaId_key" ON "TradeIdeaLike"("userId", "tradeIdeaId");

-- AddForeignKey
ALTER TABLE "TradeIdeaLike" ADD CONSTRAINT "TradeIdeaLike_tradeIdeaId_fkey" FOREIGN KEY ("tradeIdeaId") REFERENCES "TradeIdea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
