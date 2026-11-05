import { createFileRoute } from "@tanstack/react-router";
import { PiggyBank, Plus } from "lucide-react";
import { useState } from "react";
import { CartaoMeta } from "@/components/app/CartaoMeta";
import { DrawerAporte } from "@/components/app/DrawerAporte";
import { DrawerMeta } from "@/components/app/DrawerMeta";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { metasQueryOptions, useMetas } from "@/hooks/useMetas";
import type { Meta } from "@/lib/finance";

export const Route = createFileRoute("/app/metas/")({
	loader: ({ context }) =>
		context.queryClient.query(metasQueryOptions()),
	component: Metas,
});

function Metas() {
	const { data: metas } = useMetas();
	const [drawerMetaAberto, setDrawerMetaAberto] = useState(false);
	const [metaEditada, setMetaEditada] = useState<Meta | null>(null);
	const [drawerAporteAberto, setDrawerAporteAberto] = useState(false);
	const [metaDoAporte, setMetaDoAporte] = useState<Meta | null>(null);

	function abrirDrawerMeta(meta: Meta | null) {
		setMetaEditada(meta);
		setDrawerMetaAberto(true);
	}
	function abrirDrawerAporte(meta: Meta) {
		setMetaDoAporte(meta);
		setDrawerAporteAberto(true);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-end justify-between gap-4">
				<div>
					<p className="text-sm font-semibold text-accent-deep">
						Metas de economia
					</p>
					<h2 className="font-display text-2xl font-semibold">
						Quanto falta pra chegar lá
					</h2>
				</div>
				{metas.length > 0 && (
					<Button onClick={() => abrirDrawerMeta(null)}>
						<Plus aria-hidden="true" />
						Nova meta
					</Button>
				)}
			</div>
			{metas.length === 0 ? (
				<Empty className="border border-line bg-surface">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<PiggyBank aria-hidden="true" />
						</EmptyMedia>
						<EmptyTitle>Você ainda não tem metas</EmptyTitle>
						<EmptyDescription>
							Defina um valor e quanto guardar por mês pra saber quando vai
							chegar lá.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button onClick={() => abrirDrawerMeta(null)}>
							<Plus aria-hidden="true" />
							Criar meta
						</Button>
					</EmptyContent>
				</Empty>
			) : (
				<div className="grid gap-4 sm:grid-cols-2">
					{metas.map((meta) => (
						<CartaoMeta
							key={meta.id}
							meta={meta}
							onGuardar={() => abrirDrawerAporte(meta)}
							onEditar={() => abrirDrawerMeta(meta)}
						/>
					))}
				</div>
			)}
			<DrawerMeta
				open={drawerMetaAberto}
				onOpenChange={setDrawerMetaAberto}
				meta={metaEditada}
			/>
			<DrawerAporte
				open={drawerAporteAberto}
				onOpenChange={setDrawerAporteAberto}
				meta={metaDoAporte}
			/>
		</div>
	);
}
