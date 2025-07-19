/*
  Warnings:

  - You are about to drop the column `comments` on the `TradeIdea` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TradeIdea" DROP COLUMN "comments";

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tradeIdeaId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_tradeIdeaId_fkey" FOREIGN KEY ("tradeIdeaId") REFERENCES "TradeIdea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
