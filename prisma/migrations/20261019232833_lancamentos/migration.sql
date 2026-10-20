-- CreateEnum
CREATE TYPE "TipoLancamento" AS ENUM ('entrada', 'saida');

-- CreateTable
CREATE TABLE "lancamento" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "cat" TEXT NOT NULL DEFAULT 'Outros',
    "tipo" "TipoLancamento" NOT NULL,
    "data" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lancamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lancamento_userId_data_idx" ON "lancamento"("userId", "data");

-- AddForeignKey
ALTER TABLE "lancamento" ADD CONSTRAINT "lancamento_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
