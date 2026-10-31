-- AlterTable
ALTER TABLE "user" ALTER COLUMN "saldoInicial" DROP NOT NULL,
ALTER COLUMN "saldoInicial" DROP DEFAULT;

-- Antes o zero era o padrão: ninguém havia informado o saldo.
UPDATE "user" SET "saldoInicial" = NULL WHERE "saldoInicial" = 0;
