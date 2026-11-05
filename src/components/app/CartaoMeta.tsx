import { useNavigate } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDeleteAporte } from "@/hooks/useMetas";
import {
	frasePrazo,
	type Meta,
	money,
	moneyExato,
	progressoMeta,
} from "@/lib/finance";

interface CartaoMetaProps {
	meta: Meta;
	onGuardar: () => void;
	onEditar: () => void;
}

export function CartaoMeta({ meta, onGuardar, onEditar }: CartaoMetaProps) {
	const navigate = useNavigate();
	const deleteAporte = useDeleteAporte();
	const progresso = progressoMeta(meta);
	const percentual = Math.round(progresso.percentual * 100);

	function verDetalhes() {
		navigate({ to: "/app/metas/$id", params: { id: meta.id } });
	}

	async function excluirAporte(id: string) {
		try {
			await deleteAporte.mutateAsync(id);
			toast.success("Valor removido");
		} catch {
			toast.error("Não foi possível remover. Tente novamente.");
		}
	}

	return (
		<Card
			role="button"
			tabIndex={0}
			aria-label={`Ver detalhes da meta ${meta.nome}`}
			onClick={verDetalhes}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					verDetalhes();
				}
			}}
			className="flex cursor-pointer flex-col gap-4 border border-line bg-surface p-6 shadow-float transition hover:border-accent"
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<h3 className="truncate font-display text-lg font-semibold">
						{meta.nome}
					</h3>
					<p className="text-sm text-ink-soft">{money(meta.valorMensal)}/mês</p>
				</div>
				{progresso.concluida && (
					<span className="shrink-0 rounded-control bg-accent-wash px-2 py-1 text-xs font-semibold text-accent-deep">
						Meta alcançada
					</span>
				)}
			</div>

			<div>
				<div className="flex items-baseline justify-between gap-3 text-sm">
					<span className="font-mono font-semibold tabular-nums">
						{money(meta.guardado)} de {money(meta.valorAlvo)}
					</span>
					<span className="text-ink-soft tabular-nums">{percentual}%</span>
				</div>
				<div
					role="progressbar"
					aria-label={`Progresso de ${meta.nome}`}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={percentual}
					className="mt-2 h-2 overflow-hidden rounded-full bg-surface-soft"
				>
					<div
						className="h-full rounded-full bg-accent"
						style={{ width: `${percentual}%` }}
					/>
				</div>
				{!progresso.concluida && (
					<p className="mt-2 text-sm font-medium">{frasePrazo(progresso)}</p>
				)}
			</div>

			<div className="flex gap-2">
				<Button
					onClick={(e) => {
						e.stopPropagation();
						onGuardar();
					}}
				>
					Guardar
				</Button>
				<Button
					variant="outline"
					className="border-line bg-surface text-ink hover:bg-surface-soft hover:text-ink dark:border-line dark:bg-surface dark:hover:bg-surface-soft"
					onClick={(e) => {
						e.stopPropagation();
						onEditar();
					}}
				>
					Editar
				</Button>
			</div>

			{meta.aportes.length > 0 && (
				<ul className="max-h-40 divide-y divide-line overflow-y-auto border-t border-line">
					{meta.aportes.map((aporte) => (
						<li
							key={aporte.id}
							className="flex items-center justify-between gap-3 py-1 text-sm"
						>
							<span className="text-ink-soft">
								{format(parseISO(aporte.data), "dd/MM/yyyy")}
							</span>
							<span className="ml-auto font-mono tabular-nums">
								{moneyExato(aporte.valor)}
							</span>
							<Button
								variant="ghost"
								size="icon"
								disabled={deleteAporte.isPending}
								className="text-ink-soft hover:bg-danger-wash hover:text-danger dark:hover:bg-danger-wash"
								aria-label={`Remover ${moneyExato(aporte.valor)} de ${format(parseISO(aporte.data), "dd/MM/yyyy")}`}
								onClick={(e) => {
									e.stopPropagation();
									excluirAporte(aporte.id);
								}}
							>
								<Trash2Icon aria-hidden="true" />
							</Button>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
}
