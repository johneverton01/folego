import { z } from "zod";

// Teto do valor em centavos (R$ 10 milhões) — cabe com folga no INTEGER do Postgres.
const VALOR_MAXIMO = 1_000_000_000;

const desc = z
	.string()
	.trim()
	.min(1, "Informe uma descrição")
	.min(2, "Descrição muito curta")
	.max(80, "A descrição tem no máximo 80 caracteres");

// Valor em centavos, vindo da máscara de dinheiro do input.
const valor = z
	.number({ error: "Informe um valor" })
	.int()
	.positive("Informe um valor maior que zero")
	.max(VALOR_MAXIMO, "Valor muito alto");

/** Formulário dos drawers de entrada/saída. */
export const lancamentoSchema = z.object({
	desc,
	valor,
	data: z.date({ error: "Escolha uma data" }),
});

export type LancamentoValues = z.infer<typeof lancamentoSchema>;

/** Payload aceito pela server function de criação. */
export const createLancamentoSchema = z.object({
	desc,
	valor,
	tipo: z.enum(["entrada", "saida"]),
	cat: z.string().trim().min(1).max(40).default("Outros"),
	// Data civil (sem fuso) no formato yyyy-MM-dd.
	data: z.iso.date("Data inválida"),
});

export type CreateLancamentoInput = z.input<typeof createLancamentoSchema>;

/** Filtro da listagem: mês no formato yyyy-MM (padrão: mês atual). */
export const listLancamentosSchema = z
	.object({
		mes: z
			.string()
			.regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Mês inválido")
			.optional(),
	})
	.optional();
