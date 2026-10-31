import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { DrawerLancamento } from "@/components/app/DrawerLancamento";
import { FiltrosHistorico } from "@/components/app/FiltrosHistorico";
import { ListaLancamentos } from "@/components/app/ListaLancamentos";
import { ResumoPeriodo } from "@/components/app/ResumoPeriodo";
import { SeletorPeriodo } from "@/components/app/SeletorPeriodo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  lancamentosDoPeriodoQueryOptions,
  resumoAnoQueryOptions,
  useLancamentosDoPeriodo,
  useResumoAno,
} from "@/hooks/useLancamentos";
import { type Lancamento, type Periodo, periodoDoHistorico, type Tipo } from "@/lib/finance";
import { historicoSearchSchema } from "@/lib/validations/finance";
import { authMiddleware } from "@/middleware/auth-middleware";

export const Route = createFileRoute("/app/historico")({
  beforeLoad: authMiddleware,
  validateSearch: (search) => historicoSearchSchema.parse(search),
  loaderDeps: ({ search: { ano, mes } }) => ({ ano, mes }),
  loader: ({ context, deps }) => {
    const periodo = periodoDoHistorico(deps);
    return Promise.all([
      context.queryClient.ensureQueryData(lancamentosDoPeriodoQueryOptions(periodo)),
      context.queryClient.ensureQueryData(resumoAnoQueryOptions(periodo.ano)),
    ]);
  },
  component: Historico,
});

function Historico() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { tipo, cat } = search;
  const periodo = periodoDoHistorico(search);

  const { data: lancamentos } = useLancamentosDoPeriodo(periodo);
  const { data: resumoAno } = useResumoAno(periodo.ano);

  // `editando` sobrevive ao fechar, pra o drawer manter o conteúdo durante a animação.
  const [editando, setEditando] = useState<Lancamento | null>(null);
  const [drawerAberto, setDrawerAberto] = useState(false);

  const filtrados = lancamentos.filter((l) => (!tipo || l.tipo === tipo) && (!cat || l.cat === cat));

  function trocarPeriodo({ ano, mes }: Periodo) {
    navigate({ search: (s) => ({ ...s, ano, mes: mes ?? "todos" }), resetScroll: false });
  }

  function trocarFiltros(filtros: { tipo?: Tipo; cat?: string }) {
    navigate({ search: (s) => ({ ...s, tipo: filtros.tipo, cat: filtros.cat }), resetScroll: false });
  }

  function abrirEdicao(lancamento: Lancamento) {
    setEditando(lancamento);
    setDrawerAberto(true);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-[2rem] font-semibold text-ink">Histórico</h1>
        <p className="mt-1 max-w-prose text-sm text-ink-soft">
          Escolha um ano e depois um mês para ver tudo o que entrou e saiu. Toque em um lançamento para corrigir.
        </p>
      </div>

      <Card className="shadow-float gap-4 border border-line bg-surface p-6">
        <SeletorPeriodo
          periodo={periodo}
          meses={resumoAno.meses}
          primeiroAno={resumoAno.primeiroAno}
          ultimoAno={resumoAno.ultimoAno}
          onChange={trocarPeriodo}
        />
      </Card>

      <ResumoPeriodo lancamentos={lancamentos} filtrados={filtrados} periodo={periodo} tipo={tipo} cat={cat} />

      <Card className="shadow-float gap-5 border border-line bg-surface p-6">
        <FiltrosHistorico tipo={tipo} cat={cat} onChange={trocarFiltros} />

        {filtrados.length > 0 ? (
          <ListaLancamentos lancamentos={filtrados} porMes={periodo.mes === null} onEditar={abrirEdicao} />
        ) : lancamentos.length > 0 ? (
          <p className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-ink-soft">
            Nenhum lançamento com esses filtros neste período.
          </p>
        ) : (
          <div className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-ink-soft">
            <p>Registre uma entrada ou saída no Painel e ela aparece aqui.</p>
            <Button asChild variant="link" className="text-accent-deep">
              <Link to="/app">Ir para o Painel</Link>
            </Button>
          </div>
        )}
      </Card>

      <DrawerLancamento
        open={drawerAberto}
        onOpenChange={setDrawerAberto}
        tipo={editando?.tipo ?? "saida"}
        lancamento={editando}
      />
    </div>
  );
}
