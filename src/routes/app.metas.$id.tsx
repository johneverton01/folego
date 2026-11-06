import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { ArrowLeft, PiggyBank, SearchX, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { useInsight } from "@/hooks/useInsight";
import { folegoQueryOptions, useFolego } from "@/hooks/useLancamentos";
import { metaQueryOptions, useMeta } from "@/hooks/useMetas";
import { frasePrazo, money, moneyExato, progressoMeta } from "@/lib/finance";
import { authMiddleware } from "@/middleware/auth-middleware";

export const Route = createFileRoute("/app/metas/$id")({
	beforeLoad: authMiddleware,
	loader: async ({ context, params }) => {
		// Id de outro usuário ou inexistente: getMeta rejeita e cai aqui.
		try {
			await context.queryClient.query(metaQueryOptions(params.id));
		} catch {
			throw notFound();
		}
		await context.queryClient.query(folegoQueryOptions());
	},
	notFoundComponent: MetaNaoEncontrada,
	component: MetaDetalhe,
});

function MetaNaoEncontrada() {
	return (
		<Empty className="border border-line bg-surface">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<SearchX aria-hidden="true" />
				</EmptyMedia>
				<EmptyTitle>Meta não encontrada</EmptyTitle>
				<EmptyDescription>
					Ela pode ter sido excluída ou o link está incorreto.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button asChild>
					<Link to="/app/metas">Voltar para metas</Link>
				</Button>
			</EmptyContent>
		</Empty>
	);
}

function MetaDetalhe() {
	const { id } = Route.useParams();
	const { data: meta } = useMeta(id);
	const { data: folego } = useFolego();
	const progresso = progressoMeta(meta);
	const percentual = Math.round(progresso.percentual * 100);

	return (
		<div className="space-y-4">
			<Link
				to="/app/metas"
				className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink"
			>
				<ArrowLeft aria-hidden="true" className="size-4" />
				Voltar para metas
			</Link>

			<div>
				<p className="text-sm font-semibold text-accent-deep">Meta</p>
				<h2 className="font-display text-2xl font-semibold">{meta.nome}</h2>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<Card className="border border-line bg-surface p-6 shadow-float">
					<div className="flex items-center gap-2 text-ink-soft">
						<PiggyBank aria-hidden="true" className="size-4" />
						<h3 className="font-display text-lg font-semibold text-ink">
							Guardado para essa meta
						</h3>
					</div>
					<p className="mt-3 font-mono text-2xl font-semibold tabular-nums">
						{money(meta.guardado)}{" "}
						<span className="text-base font-normal text-ink-soft">
							de {money(meta.valorAlvo)}
						</span>
					</p>
					<div
						role="progressbar"
						aria-label={`Progresso de ${meta.nome}`}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={percentual}
						className="mt-3 h-2 overflow-hidden rounded-full bg-surface-soft"
					>
						<div
							className="h-full rounded-full bg-accent"
							style={{ width: `${percentual}%` }}
						/>
					</div>
					<p className="mt-2 text-sm text-ink-soft">
						{percentual}% · {money(meta.valorMensal)}/mês
					</p>
					<p className="mt-1 text-sm font-medium">
						{progresso.concluida ? "Meta alcançada" : frasePrazo(progresso)}
					</p>
				</Card>

				<Card className="border border-line bg-surface p-6 shadow-float">
					<div className="flex items-center gap-2 text-ink-soft">
						<Wallet aria-hidden="true" className="size-4" />
						<h3 className="font-display text-lg font-semibold text-ink">
							Saldo na conta geral
						</h3>
					</div>
					<p className="mt-3 font-mono text-2xl font-semibold tabular-nums">
						{money(folego.reserva)}
					</p>
					<p className="mt-2 max-w-prose text-sm text-ink-soft">
						O que você tem guardado em todas as suas contas, além do que já
						reservou pra essa meta.
					</p>
				</Card>
			</div>

			<SugestaoIA id={meta.id} />

			{meta.aportes.length > 0 && (
				<Card className="border border-line bg-surface p-6 shadow-float">
					<h3 className="mb-3 font-display text-lg font-semibold">
						Histórico de valores guardados
					</h3>
					<ul className="divide-y divide-line">
						{meta.aportes.map((aporte) => (
							<li
								key={aporte.id}
								className="flex items-center justify-between gap-3 py-2 text-sm"
							>
								<span className="text-ink-soft">
									{format(parseISO(aporte.data), "dd/MM/yyyy")}
								</span>
								<span className="font-mono tabular-nums">
									{moneyExato(aporte.valor)}
								</span>
							</li>
						))}
					</ul>
				</Card>
			)}
		</div>
	);
}

const FEASIBILITY_LABEL: Record<string, string> = {
	viable: "Viável no ritmo atual",
	needs_adjustment: "Precisa de um ajuste",
	unfeasible: "Inviável no ritmo atual",
};

function SugestaoIA({ id }: { id: string }) {
	const { data: insight, isPending, isError } = useInsight(id);

	return (
		<Card className="border border-dashed border-line bg-surface-soft p-6 shadow-float">
			<div className="flex items-center gap-2 text-ink-soft">
				<Sparkles aria-hidden="true" className="size-4" />
				<h3 className="font-display text-lg font-semibold text-ink">
					Sugestão da IA
				</h3>
			</div>

			{isPending && (
				<p className="mt-2 max-w-prose text-sm text-ink-soft">
					Analisando seu saldo e seu ritmo de aportes...
				</p>
			)}

			{isError && (
				<p className="mt-2 max-w-prose text-sm text-ink-soft">
					Não foi possível gerar a sugestão agora. Tente novamente mais tarde.
				</p>
			)}

			{insight && (
				<div className="mt-3 space-y-4 text-sm">
					<p className="font-semibold text-accent-deep">
						{FEASIBILITY_LABEL[insight.feasibility.status]}
					</p>
					<p className="text-ink">{insight.diagnosis.content}</p>

					<InsightLista titulo="Sugestões" items={insight.suggestions.items} />
					<InsightLista
						titulo="Renda extra"
						items={insight.extraIncome.items}
					/>
					<InsightLista
						titulo="Investimento"
						items={insight.investment.items}
					/>

					<p className="font-medium text-ink">{insight.motivation.content}</p>
				</div>
			)}
		</Card>
	);
}

function InsightLista({ titulo, items }: { titulo: string; items: string[] }) {
	if (items.length === 0) return null;
	return (
		<div>
			<p className="font-semibold text-ink">{titulo}</p>
			<ul className="mt-1 list-disc space-y-1 pl-4 text-ink-soft">
				{items.map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
		</div>
	);
}
