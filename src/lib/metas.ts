import { createServerFn } from "@tanstack/react-start";
import type { Aporte, Meta } from "@/lib/finance";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/sessao-server";
import {
	createAporteSchema,
	deleteAporteSchema,
	deleteMetaSchema,
	metaIdSchema,
	metaSchema,
	updateMetaSchema,
} from "@/lib/validations/finance";

function toAporte(row: { id: string; valor: number; data: Date }): Aporte {
	return {
		id: row.id,
		valor: row.valor / 100,
		data: row.data.toISOString().slice(0, 10),
	};
}

function toMeta(row: {
	id: string;
	nome: string;
	valorAlvo: number;
	valorMensal: number;
	aportes: { id: string; valor: number; data: Date }[];
}): Meta {
	return {
		id: row.id,
		nome: row.nome,
		valorAlvo: row.valorAlvo / 100,
		valorMensal: row.valorMensal / 100,
		// Soma em centavos: somar os reais acumularia erro de ponto flutuante.
		guardado: row.aportes.reduce((total, a) => total + a.valor, 0) / 100,
		aportes: row.aportes.map(toAporte),
	};
}

const comAportes = {
	aportes: {
		orderBy: [{ data: "desc" as const }, { createdAt: "desc" as const }],
	},
};

/** Metas do usuário logado com seus aportes, da mais antiga pra mais recente. */
export const getMetas = createServerFn({ method: "GET" }).handler(async () => {
	const userId = await requireUserId();
	const rows = await prisma.meta.findMany({
		where: { userId },
		include: comAportes,
		orderBy: { createdAt: "asc" },
	});
	return rows.map(toMeta);
});

/** Uma meta do usuário logado, com seus aportes. */
export const getMeta = createServerFn({ method: "GET" })
	.validator(metaIdSchema)
	.handler(async ({ data: { id } }) => {
		const userId = await requireUserId();
		const row = await prisma.meta.findFirst({
			where: { id, userId },
			include: comAportes,
		});
		if (!row) throw new Error("Meta não encontrada");
		return toMeta(row);
	});

/** Cria uma meta para o usuário logado. */
export const createMeta = createServerFn({ method: "POST" })
	.validator(metaSchema)
	.handler(async ({ data: input }) => {
		const userId = await requireUserId();
		const row = await prisma.meta.create({
			data: { userId, ...input },
			include: comAportes,
		});
		return toMeta(row);
	});

/** Edita uma meta do usuário logado; os aportes continuam. */
export const updateMeta = createServerFn({ method: "POST" })
	.validator(updateMetaSchema)
	.handler(async ({ data: { id, ...input } }) => {
		const userId = await requireUserId();
		// Sempre por `userId` também: o id vem do cliente.
		const { count } = await prisma.meta.updateMany({
			where: { id, userId },
			data: input,
		});
		if (count === 0) throw new Error("Meta não encontrada");
	});

/** Exclui uma meta do usuário logado junto com seus aportes. */
export const deleteMeta = createServerFn({ method: "POST" })
	.validator(deleteMetaSchema)
	.handler(async ({ data: { id } }) => {
		const userId = await requireUserId();
		const { count } = await prisma.meta.deleteMany({ where: { id, userId } });
		if (count === 0) throw new Error("Meta não encontrada");
	});

/** Registra um valor guardado em uma meta do usuário logado. */
export const createAporte = createServerFn({ method: "POST" })
	.validator(createAporteSchema)
	.handler(async ({ data: { metaId, valor, data } }) => {
		const userId = await requireUserId();
		const meta = await prisma.meta.findFirst({ where: { id: metaId, userId } });
		if (!meta) throw new Error("Meta não encontrada");
		const row = await prisma.aporte.create({
			data: { metaId, valor, data: new Date(`${data}T00:00:00.000Z`) },
		});
		return toAporte(row);
	});

/** Exclui um aporte de uma meta do usuário logado. */
export const deleteAporte = createServerFn({ method: "POST" })
	.validator(deleteAporteSchema)
	.handler(async ({ data: { id } }) => {
		const userId = await requireUserId();
		const { count } = await prisma.aporte.deleteMany({
			where: { id, meta: { userId } },
		});
		if (count === 0) throw new Error("Aporte não encontrado");
	});
