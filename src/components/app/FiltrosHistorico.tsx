import { Button } from "@/components/ui/button";
import { CategoryPicker } from "@/components/ui/category-picker";
import { CATEGORIAS, type Tipo } from "@/lib/finance";

const TIPOS = {
	Todos: undefined,
	Entradas: "entrada",
	Saídas: "saida",
} as const;
type RotuloTipo = keyof typeof TIPOS;

const TODAS = "Todas";

function rotuloDoTipo(tipo?: Tipo) {
	return (Object.keys(TIPOS) as RotuloTipo[]).find((r) => TIPOS[r] === tipo);
}

interface FiltrosHistoricoProps {
	tipo?: Tipo;
	cat?: string;
	onChange: (filtros: { tipo?: Tipo; cat?: string }) => void;
}

export function FiltrosHistorico({
	tipo,
	cat,
	onChange,
}: FiltrosHistoricoProps) {
	const categorias = tipo
		? CATEGORIAS[tipo]
		: [...new Set([...CATEGORIAS.entrada, ...CATEGORIAS.saida])];

	return (
		<div className="space-y-3">
			<div className="space-y-2">
				<p id="filtro-tipo" className="text-sm font-medium text-ink">
					Tipo
				</p>
				<CategoryPicker
					aria-labelledby="filtro-tipo"
					options={Object.keys(TIPOS)}
					value={rotuloDoTipo(tipo)}
					// Entradas e saídas têm categorias diferentes: trocar o tipo limpa a categoria.
					onValueChange={(rotulo) =>
						onChange({ tipo: TIPOS[rotulo as RotuloTipo] })
					}
				/>
			</div>
			<div className="space-y-2">
				<p id="filtro-categoria" className="text-sm font-medium text-ink">
					Categoria
				</p>
				<CategoryPicker
					aria-labelledby="filtro-categoria"
					options={[TODAS, ...categorias]}
					value={cat ?? TODAS}
					onValueChange={(valor) =>
						onChange({ tipo, cat: valor === TODAS ? undefined : valor })
					}
				/>
			</div>
			{(tipo || cat) && (
				<Button
					type="button"
					variant="link"
					className="h-auto p-0 text-accent-deep"
					onClick={() => onChange({})}
				>
					Limpar filtros
				</Button>
			)}
		</div>
	);
}
