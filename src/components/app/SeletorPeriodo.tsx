import { cn } from "cn";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { RadioGroup } from "radix-ui";

import { Button } from "@/components/ui/button";
import {
	chaveMes,
	type HistoricoMes,
	MESES,
	mesAtual,
	moneyComSinal,
	type Periodo,
} from "@/lib/finance";

const BOTAO_NEUTRO =
	"border-line bg-surface text-ink hover:bg-surface-soft hover:text-ink dark:border-line dark:bg-surface dark:hover:bg-surface-soft";

interface SeletorPeriodoProps {
	periodo: Periodo;
	meses: HistoricoMes[];
	primeiroAno: number | null;
	ultimoAno: number | null;
	onChange: (periodo: Periodo) => void;
}

function MesTile({
	numero,
	total,
	desabilitado,
}: {
	numero: number;
	total: HistoricoMes | undefined;
	desabilitado: boolean;
}) {
	const entrou = total?.entrou ?? 0;
	const saiu = total?.saiu ?? 0;
	const saldo = entrou - saiu;
	const temMovimento = entrou > 0 || saiu > 0;

	return (
		<RadioGroup.Item
			value={String(numero)}
			disabled={desabilitado}
			className={cn(
				"flex min-w-0 cursor-pointer flex-col items-start gap-1 rounded-control border border-line bg-surface px-3 py-2.5 text-left outline-none transition-[border-color,background-color,box-shadow] duration-150",
				"hover:border-accent focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-wash",
				"data-[state=checked]:border-accent data-[state=checked]:bg-accent-wash",
				"disabled:cursor-not-allowed disabled:bg-surface-soft disabled:opacity-50 disabled:hover:border-line",
				"motion-reduce:transition-none",
			)}
		>
			<span className="text-sm font-medium text-ink capitalize">
				{MESES[numero - 1].slice(0, 3)}
			</span>
			<span
				className={cn(
					"max-w-full truncate font-mono text-xs tabular-nums",
					!temMovimento && "text-ink-faint",
					temMovimento && saldo < 0 ? "text-danger" : "text-ink-soft",
				)}
			>
				{temMovimento ? moneyComSinal(saldo) : "—"}
			</span>
		</RadioGroup.Item>
	);
}

/** Navegação por ano e mês: mostra o saldo de cada mês antes mesmo de abrir. */
export function SeletorPeriodo({
	periodo,
	meses,
	primeiroAno,
	ultimoAno,
	onChange,
}: SeletorPeriodoProps) {
	const { ano, mes } = periodo;
	const hoje = mesAtual();
	const anoAtual = Number(hoje.slice(0, 4));
	const anoMinimo = Math.min(primeiroAno ?? anoAtual, anoAtual);
	const anoMaximo = Math.max(ultimoAno ?? anoAtual, anoAtual);

	function trocarAno(novoAno: number) {
		// Mantém o mês ao trocar de ano, exceto se ele ainda não aconteceu.
		const futuro = mes !== null && chaveMes(novoAno, mes) > hoje;
		onChange({ ano: novoAno, mes: futuro ? Number(hoje.slice(5)) : mes });
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-1">
					<Button
						type="button"
						variant="outline"
						size="icon"
						className={BOTAO_NEUTRO}
						aria-label="Ano anterior"
						disabled={ano <= anoMinimo}
						onClick={() => trocarAno(ano - 1)}
					>
						<ChevronLeftIcon aria-hidden="true" />
					</Button>
					<span
						aria-live="polite"
						className="w-16 text-center font-display text-lg font-semibold text-ink"
					>
						{ano}
					</span>
					<Button
						type="button"
						variant="outline"
						size="icon"
						className={BOTAO_NEUTRO}
						aria-label="Próximo ano"
						disabled={ano >= anoMaximo}
						onClick={() => trocarAno(ano + 1)}
					>
						<ChevronRightIcon aria-hidden="true" />
					</Button>
				</div>
				<Button
					type="button"
					variant="outline"
					aria-pressed={mes === null}
					className={cn(
						BOTAO_NEUTRO,
						mes === null &&
							"border-accent bg-accent-wash text-accent-deep hover:bg-accent-wash hover:text-accent-deep dark:border-accent dark:bg-accent-wash dark:hover:bg-accent-wash",
					)}
					onClick={() => onChange({ ano, mes: null })}
				>
					Ano inteiro
				</Button>
			</div>

			<RadioGroup.Root
				aria-label={`Meses de ${ano}`}
				className="grid grid-cols-3 gap-2 sm:grid-cols-4"
				value={mes === null ? "" : String(mes)}
				onValueChange={(valor) => onChange({ ano, mes: Number(valor) })}
			>
				{MESES.map((_, indice) => {
					const numero = indice + 1;
					const chave = chaveMes(ano, numero);
					const total = meses.find((m) => m.mes === chave);
					const temMovimento = !!total && (total.entrou > 0 || total.saiu > 0);
					return (
						<MesTile
							key={numero}
							numero={numero}
							total={total}
							// Lançamento com data futura mantém o mês acessível.
							desabilitado={chave > hoje && !temMovimento}
						/>
					);
				})}
			</RadioGroup.Root>

			<p className="text-xs text-ink-faint">
				O valor em cada mês é o saldo: o que entrou menos o que saiu. Meses em
				vermelho e com sinal de menos fecharam gastando mais do que receberam.
			</p>
		</div>
	);
}
