import {
	fraseFiltros,
	frasePeriodo,
	type Lancamento,
	type Periodo,
	type Tipo,
} from "@/lib/finance";

interface ResumoPeriodoProps {
	lancamentos: Lancamento[];
	filtrados: Lancamento[];
	periodo: Periodo;
	tipo?: Tipo;
	cat?: string;
}

/** Diz em português claro o que está na tela. */
export function ResumoPeriodo({
	lancamentos,
	filtrados,
	periodo,
	tipo,
	cat,
}: ResumoPeriodoProps) {
	const filtros = fraseFiltros(filtrados, tipo, cat);
	return (
		<div
			aria-live="polite"
			className="rounded-control bg-accent-wash px-4 py-3 text-sm text-ink"
		>
			<p>{frasePeriodo(lancamentos, periodo)}</p>
			{filtros && <p className="mt-1 text-ink-soft">{filtros}</p>}
		</div>
	);
}
