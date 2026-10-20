import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import { type Lancamento, mesAtual } from "@/lib/finance";
import { prisma } from "@/lib/prisma";
import {
	createLancamentoSchema,
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
