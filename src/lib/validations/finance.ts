import { z } from "zod";
import { CATEGORIAS } from "@/lib/finance";

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
	cat: z.string().min(1, "Escolha uma categoria"),
	data: z.date({ error: "Escolha uma data" }),
});

export type LancamentoValues = z.infer<typeof lancamentoSchema>;

/** Payload aceito pela server function de criação. */
export const createLancamentoSchema = z
	.object({
		desc,
		valor,
		tipo: z.enum(["entrada", "saida"]),
		cat: z.string(),
		// Data civil (sem fuso) no formato yyyy-MM-dd.
		data: z.iso.date("Data inválida"),
	})
	.refine(({ tipo, cat }) => CATEGORIAS[tipo].includes(cat), {
		path: ["cat"],
		message: "Categoria inválida",
	});

export type CreateLancamentoInput = z.input<typeof createLancamentoSchema>;

/**
 * Payload da edição. Não inclui `tipo`, que não muda depois de criado:
 * a categoria é validada no servidor contra o tipo salvo no banco.
 */
export const updateLancamentoSchema = z.object({
	id: z.string().min(1),
	desc,
	valor,
	cat: z.string().min(1),
	data: z.iso.date("Data inválida"),
});

export type UpdateLancamentoInput = z.input<typeof updateLancamentoSchema>;

export const deleteLancamentoSchema = z.object({ id: z.string().min(1) });

/** Formulário do drawer de meta. */
export const metaSchema = z.object({
	nome: z
		.string()
		.trim()
		.min(1, "Informe um nome")
		.min(2, "Nome muito curto")
		.max(80, "O nome tem no máximo 80 caracteres"),
	valorAlvo: valor,
	valorMensal: valor,
});

export type MetaValues = z.infer<typeof metaSchema>;

export const updateMetaSchema = metaSchema.extend({ id: z.string().min(1) });

export type UpdateMetaInput = z.input<typeof updateMetaSchema>;

export const deleteMetaSchema = z.object({ id: z.string().min(1) });

export const metaIdSchema = z.object({ id: z.string().min(1) });

/** Formulário do drawer de aporte. */
export const aporteSchema = z.object({
	valor,
	data: z.date({ error: "Escolha uma data" }),
});

export type AporteValues = z.infer<typeof aporteSchema>;

export const createAporteSchema = z.object({
	metaId: z.string().min(1),
	valor,
	// Data civil (sem fuso) no formato yyyy-MM-dd.
	data: z.iso.date("Data inválida"),
});

export type CreateAporteInput = z.input<typeof createAporteSchema>;

export const deleteAporteSchema = z.object({ id: z.string().min(1) });

/** Saldo em conta hoje, em centavos; zero é válido. */
export const saldoAtualSchema = z.object({
	saldoAtual: z
		.number({ error: "Informe um valor" })
		.int()
		.min(0, "Informe um valor positivo")
		.max(VALOR_MAXIMO, "Valor muito alto"),
});

export type SaldoAtualValues = z.infer<typeof saldoAtualSchema>;

const ano = z.number().int().min(2000).max(2100);
const mes = z.number().int().min(1).max(12);

/** Lançamentos de um ano, ou de um mês dele quando `mes` vem preenchido. */
export const lancamentosDoPeriodoSchema = z.object({
	ano,
	mes: mes.optional(),
});

export const resumoAnoSchema = z.object({ ano });

/** Filtros da tela de histórico na URL; valor inválido é ignorado em vez de quebrar a página. */
export const historicoSearchSchema = z.object({
	ano: ano.optional().catch(undefined),
	mes: z
		.union([mes, z.literal("todos")])
		.optional()
		.catch(undefined),
	tipo: z.enum(["entrada", "saida"]).optional().catch(undefined),
	cat: z.string().max(40).optional().catch(undefined),
});

export type HistoricoSearch = z.infer<typeof historicoSearchSchema>;

/** Filtro da listagem: mês no formato yyyy-MM (padrão: mês atual). */
export const listLancamentosSchema = z
	.object({
		mes: z
			.string()
			.regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Mês inválido")
			.optional(),
	})
	.optional();

/** Histórico mensal: quantos meses (terminando no mês atual) agregar. */
export const historicoMensalSchema = z
	.object({
		meses: z.number().int().min(1).max(24).optional(),
	})
	.optional();
