-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "description" TEXT,
ADD COLUMN     "order" INTEGER,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'todo';
