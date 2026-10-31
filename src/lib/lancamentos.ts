import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import {
	CATEGORIAS,
	calcularFolego,
	chaveMes,
	type Folego,
	type HistoricoMes,
	type Lancamento,
	mesAtual,
	mesesAte,
} from "@/lib/finance";
import { prisma } from "@/lib/prisma";
import {
	createLancamentoSchema,
	deleteLancamentoSchema,
	historicoMensalSchema,
	lancamentosDoPeriodoSchema,
	listLancamentosSchema,
	resumoAnoSchema,
	saldoAtualSchema,
	updateLancamentoSchema,
} from "@/lib/validations/finance";

async function requireUserId() {
	const session = await auth.api.getSession({ headers: getRequest().headers });
	if (!session) throw new Error("Não autenticado");
	return session.user.id;
}

// `data` é uma coluna DATE: trabalhamos sempre em UTC pra não deslocar o dia.
function intervaloDoMes(mes: string) {
	const [ano, m] = mes.split("-").map(Number);
	return {
		gte: new Date(Date.UTC(ano, m - 1, 1)),
		lt: new Date(Date.UTC(ano, m, 1)),
	};
}

function intervaloDoAno(ano: number) {
	return {
		gte: new Date(Date.UTC(ano, 0, 1)),
		lt: new Date(Date.UTC(ano + 1, 0, 1)),
	};
}

/** Soma entradas e saídas por mês; lançamentos fora de `meses` são ignorados. */
function totaisPorMes(
	meses: string[],
	rows: { valor: number; tipo: "entrada" | "saida"; data: Date }[],
): HistoricoMes[] {
	const porMes = new Map(
		meses.map((mes) => [mes, { mes, entrou: 0, saiu: 0 }]),
	);
	for (const row of rows) {
		const total = porMes.get(row.data.toISOString().slice(0, 7));
		if (!total) continue;
		if (row.tipo === "entrada") total.entrou += row.valor / 100;
		else total.saiu += row.valor / 100;
	}
	return [...porMes.values()];
}

function toLancamento(row: {
	id: string;
	desc: string;
	valor: number;
	cat: string;
	tipo: "entrada" | "saida";
	data: Date;
}): Lancamento {
	return {
		id: row.id,
		desc: row.desc,
		valor: row.valor / 100,
		cat: row.cat,
		tipo: row.tipo,
		data: row.data.toISOString().slice(0, 10),
	};
}

/** Entradas e saídas do usuário logado no mês informado (padrão: mês atual). */
export const getLancamentosDoMes = createServerFn({ method: "GET" })
	.validator(listLancamentosSchema)
	.handler(async ({ data: input }) => {
		const userId = await requireUserId();
		const rows = await prisma.lancamento.findMany({
			where: { userId, data: intervaloDoMes(input?.mes ?? mesAtual()) },
			orderBy: [{ data: "desc" }, { createdAt: "desc" }],
		});
		return rows.map(toLancamento);
	});

/** Total de entradas e saídas por mês, dos últimos `meses` meses até o atual. */
export const getHistoricoMensal = createServerFn({ method: "GET" })
	.validator(historicoMensalSchema)
	.handler(async ({ data: input }): Promise<HistoricoMes[]> => {
		const userId = await requireUserId();
		const meses = mesesAte(mesAtual(), input?.meses ?? 6);
		const rows = await prisma.lancamento.findMany({
			where: {
				userId,
				data: {
					gte: intervaloDoMes(meses[0]).gte,
					lt: intervaloDoMes(meses[meses.length - 1]).lt,
				},
			},
			select: { valor: true, tipo: true, data: true },
		});
		return totaisPorMes(meses, rows);
	});

/** Lançamentos do ano, ou de um mês dele, do mais recente pro mais antigo. */
export const getLancamentosDoPeriodo = createServerFn({ method: "GET" })
	.validator(lancamentosDoPeriodoSchema)
	.handler(async ({ data: { ano, mes } }) => {
		const userId = await requireUserId();
		const rows = await prisma.lancamento.findMany({
			where: {
				userId,
				data: mes ? intervaloDoMes(chaveMes(ano, mes)) : intervaloDoAno(ano),
			},
			orderBy: [{ data: "desc" }, { createdAt: "desc" }],
		});
		return rows.map(toLancamento);
	});

/** Totais dos 12 meses do ano e até onde vão os lançamentos do usuário. */
export const getResumoAno = createServerFn({ method: "GET" })
	.validator(resumoAnoSchema)
	.handler(async ({ data: { ano } }) => {
		const userId = await requireUserId();
		const [rows, limites] = await Promise.all([
			prisma.lancamento.findMany({
				where: { userId, data: intervaloDoAno(ano) },
				select: { valor: true, tipo: true, data: true },
			}),
			prisma.lancamento.aggregate({
				where: { userId },
				_min: { data: true },
				_max: { data: true },
			}),
		]);
		return {
			meses: totaisPorMes(mesesAte(chaveMes(ano, 12), 12), rows),
			primeiroAno: limites._min.data?.getUTCFullYear() ?? null,
			ultimoAno: limites._max.data?.getUTCFullYear() ?? null,
		};
	});

/**
 * Entradas e saídas em centavos até o fim do mês atual.
 * Lançamentos em meses futuros ainda não são dinheiro na mão.
 */
async function totaisAteOMesAtual(userId: string) {
	const totais = await prisma.lancamento.groupBy({
		by: ["tipo"],
		where: { userId, data: { lt: intervaloDoMes(mesAtual()).lt } },
		_sum: { valor: true },
	});
	const total = (tipo: "entrada" | "saida") =>
		totais.find((t) => t.tipo === tipo)?._sum.valor ?? 0;
	return { entrou: total("entrada"), saiu: total("saida") };
}

/** Reserva e fôlego do usuário logado, a partir de tudo que ele lançou até o mês atual. */
export const getFolego = createServerFn({ method: "GET" }).handler(
	async (): Promise<Folego> => {
		const userId = await requireUserId();
		const mes = mesAtual();
		const meses = mesesAte(mes, 4);
		const [user, { entrou, saiu }, rows] = await Promise.all([
			prisma.user.findUniqueOrThrow({
				where: { id: userId },
				select: { saldoInicial: true },
			}),
			totaisAteOMesAtual(userId),
			prisma.lancamento.findMany({
				where: {
					userId,
					data: {
						gte: intervaloDoMes(meses[0]).gte,
						lt: intervaloDoMes(mes).lt,
					},
				},
				select: { valor: true, tipo: true, data: true },
			}),
		]);
		return calcularFolego({
			saldoInicial:
				user.saldoInicial === null ? null : user.saldoInicial / 100,
			entrou: entrou / 100,
			saiu: saiu / 100,
			historico: totaisPorMes(meses, rows),
		});
	},
);

/** Faz a reserva do usuário logado bater com o saldo que ele tem em conta hoje. */
export const updateSaldoAtual = createServerFn({ method: "POST" })
	.validator(saldoAtualSchema)
	.handler(async ({ data: { saldoAtual } }) => {
		const userId = await requireUserId();
		const { entrou, saiu } = await totaisAteOMesAtual(userId);
		await prisma.user.update({
			where: { id: userId },
			data: { saldoInicial: saldoAtual - (entrou - saiu) },
		});
	});

/** Registra uma entrada ou saída para o usuário logado. */
export const createLancamento = createServerFn({ method: "POST" })
	.validator(createLancamentoSchema)
	.handler(async ({ data: input }) => {
		const userId = await requireUserId();
		const row = await prisma.lancamento.create({
			data: {
				userId,
				desc: input.desc,
				valor: input.valor,
				cat: input.cat,
				tipo: input.tipo,
				data: new Date(`${input.data}T00:00:00.000Z`),
			},
		});
		return toLancamento(row);
	});

/** Edita um lançamento do usuário logado; o tipo não muda. */
export const updateLancamento = createServerFn({ method: "POST" })
	.validator(updateLancamentoSchema)
	.handler(async ({ data: { id, ...input } }) => {
		const userId = await requireUserId();
		// Sempre por `userId` também: o id vem do cliente.
		const atual = await prisma.lancamento.findFirst({ where: { id, userId } });
		if (!atual) throw new Error("Lançamento não encontrado");
		// Categoria antiga, fora da lista atual, continua aceita enquanto não mudar.
		if (input.cat !== atual.cat && !CATEGORIAS[atual.tipo].includes(input.cat)) {
			throw new Error("Categoria inválida");
		}
		const row = await prisma.lancamento.update({
			where: { id, userId },
			data: {
				desc: input.desc,
				valor: input.valor,
				cat: input.cat,
				data: new Date(`${input.data}T00:00:00.000Z`),
			},
		});
		return toLancamento(row);
	});

/** Exclui definitivamente um lançamento do usuário logado. */
export const deleteLancamento = createServerFn({ method: "POST" })
	.validator(deleteLancamentoSchema)
	.handler(async ({ data: { id } }) => {
		const userId = await requireUserId();
		const { count } = await prisma.lancamento.deleteMany({
			where: { id, userId },
		});
		if (count === 0) throw new Error("Lançamento não encontrado");
	});
