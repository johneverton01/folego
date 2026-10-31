import {
	CAT_COLOR,
	agruparLancamentos,
	moneyComSinal,
	moneyExato,
	type Lancamento,
} from "@/lib/finance";

interface ListaLancamentosProps {
	lancamentos: Lancamento[];
	/** No ano inteiro agrupa por mês; dentro de um mês, por dia. */
	porMes: boolean;
	onEditar: (lancamento: Lancamento) => void;
}

function dataCurta(data: string) {
	const [, mes, dia] = data.split("-");
	return `${dia}/${mes}`;
}

export function ListaLancamentos({
	lancamentos,
	porMes,
	onEditar,
}: ListaLancamentosProps) {
	return (
		<div className="space-y-5">
			{agruparLancamentos(lancamentos, porMes).map((grupo) => (
				<section key={grupo.titulo}>
					<h3 className="mb-2 text-sm font-medium text-ink-soft first-letter:uppercase">
						{grupo.titulo}
					</h3>
					<ul className="divide-y divide-line overflow-hidden rounded-control border border-line">
						{grupo.lancamentos.map((l) => (
							<li key={l.id}>
								<button
									type="button"
									aria-label={`Editar ${l.desc}`}
									className="flex w-full cursor-pointer items-center gap-3 bg-surface px-4 py-3 text-left outline-none hover:bg-surface-soft focus-visible:bg-surface-soft focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-accent-wash"
									onClick={() => onEditar(l)}
								>
									<i
										aria-hidden="true"
										className="size-2.5 shrink-0 rounded-full"
										style={{
											backgroundColor: CAT_COLOR[l.cat] ?? CAT_COLOR.Outros,
										}}
									/>
									<span className="min-w-0 flex-1">
										<span className="block truncate text-sm font-medium text-ink">
											{l.desc}
										</span>
										<span className="block truncate text-xs text-ink-faint">
											{l.cat} · {dataCurta(l.data)}
										</span>
									</span>
									<span className="font-mono text-sm font-semibold whitespace-nowrap text-ink tabular-nums">
										{moneyComSinal(
											l.tipo === "entrada" ? l.valor : -l.valor,
											moneyExato,
										)}
									</span>
								</button>
							</li>
						))}
					</ul>
				</section>
			))}
		</div>
	);
}
