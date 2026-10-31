import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import {
	type HistoricoMes,
	type Lancamento,
	mesAtual,
	mesesAte,
} from "@/lib/finance";
import { prisma } from "@/lib/prisma";
import {
	createLancamentoSchema,
	historicoMensalSchema,
	listLancamentosSchema,
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
