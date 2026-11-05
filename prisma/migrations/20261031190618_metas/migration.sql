-- CreateTable
CREATE TABLE "meta" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "valorAlvo" INTEGER NOT NULL,
    "valorMensal" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aporte" (
    "id" TEXT NOT NULL,
    "metaId" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "data" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aporte_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "meta_userId_idx" ON "meta"("userId");

-- CreateIndex
CREATE INDEX "aporte_metaId_data_idx" ON "aporte"("metaId", "data");

-- AddForeignKey
ALTER TABLE "meta" ADD CONSTRAINT "meta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aporte" ADD CONSTRAINT "aporte_metaId_fkey" FOREIGN KEY ("metaId") REFERENCES "meta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
