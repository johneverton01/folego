// Núcleo de cálculo do Fôlego — puro, testável, sem UI.
export type Tipo = 'entrada' | 'saida'

export interface Lancamento {
  id: string
  desc: string
  valor: number
  cat: string
  tipo: Tipo
  data: string // ISO
}

export const CATEGORIAS: Record<Tipo, readonly string[]> = {
  entrada: ['Contrato PJ', 'Freela', 'Outros'],
  saida: ['Casa', 'Comida', 'Impostos/PJ', 'Lazer', 'Transporte', 'Assinaturas', 'Outros'],
}

export const CAT_COLOR: Record<string, string> = {
  Casa: '#268C5C', Comida: '#7FB98F', 'Impostos/PJ': '#C9871E',
  Lazer: '#7C9CE0', Transporte: '#5FB0C9', Assinaturas: '#B98FD0', Outros: '#B0938A',
}

export type Semaforo = 'ok' | 'warn' | 'hot'

export const soma = (l: Lancamento[]) => l.reduce((a, b) => a + b.valor, 0)
export const money = (n: number) => 'R$ ' + Math.round(n).toLocaleString('pt-BR')

export interface Resumo {
  entrou: number
  saiu: number
  sobrou: number
  folegoMeses: number
  semaforo: Semaforo
}

/** Fôlego = reserva / gasto do mês. A métrica central pra renda irregular. */
export function resumo(lancamentos: Lancamento[], reserva: number): Resumo {
  const entrou = soma(lancamentos.filter((l) => l.tipo === 'entrada'))
  const saiu = soma(lancamentos.filter((l) => l.tipo === 'saida'))
  const folegoMeses = saiu > 0 ? reserva / saiu : 6
  const semaforo: Semaforo = folegoMeses >= 3 ? 'ok' : folegoMeses >= 1.5 ? 'warn' : 'hot'
  return { entrou, saiu, sobrou: entrou - saiu, folegoMeses, semaforo }
}

/** Gastos agrupados por categoria, do maior pro menor. */
export function gastosPorCategoria(lancamentos: Lancamento[]) {
  const grupos = new Map<string, number>()
  for (const l of lancamentos.filter((l) => l.tipo === 'saida')) {
    grupos.set(l.cat, (grupos.get(l.cat) ?? 0) + l.valor)
  }
  return [...grupos.entries()]
    .map(([cat, valor]) => ({ cat, valor, cor: CAT_COLOR[cat] ?? '#B0938A' }))
    .sort((a, b) => b.valor - a.valor)
}

/** Simulador de metas: quanto por mês -> quantos meses e data-alvo. */
export function simularMeta(alvo: number, porMes: number) {
  const meses = Math.max(1, Math.ceil(alvo / porMes))
  const quando = new Date()
  quando.setMonth(quando.getMonth() + meses)
  return { meses, quando }
}
