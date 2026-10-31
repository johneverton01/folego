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
  'Contrato PJ': '#3F6FD8', Freela: '#E0A030',
}

export type Semaforo = 'ok' | 'warn' | 'hot'

/** Fuso de referência do app: servidor e navegador calculam "mês atual" igual. */
export const APP_TIME_ZONE = 'America/Sao_Paulo'

const anoMesFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: APP_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
})

/** Mês atual no fuso America/Sao_Paulo, no formato yyyy-MM. */
export function mesAtual(date = new Date()) {
  const parts = anoMesFormatter.formatToParts(date)
  const ano = parts.find((p) => p.type === 'year')?.value
  const mes = parts.find((p) => p.type === 'month')?.value
  return `${ano}-${mes}`
}

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

/** Entradas ou saídas agrupadas por categoria, do maior pro menor, com a fatia (0–1) de cada uma. */
export function totaisPorCategoria(lancamentos: Lancamento[], tipo: Tipo) {
  const doTipo = lancamentos.filter((l) => l.tipo === tipo)
  const total = soma(doTipo)
  const grupos = new Map<string, number>()
  for (const l of doTipo) {
    grupos.set(l.cat, (grupos.get(l.cat) ?? 0) + l.valor)
  }
  return [...grupos.entries()]
    .map(([cat, valor]) => ({ cat, valor, fatia: valor / total, cor: CAT_COLOR[cat] ?? CAT_COLOR.Outros }))
    .sort((a, b) => b.valor - a.valor)
}

/** Simulador de metas: quanto por mês -> quantos meses e data-alvo. */
export function simularMeta(alvo: number, porMes: number) {
  const meses = Math.max(1, Math.ceil(alvo / porMes))
  const quando = new Date()
  quando.setMonth(quando.getMonth() + meses)
  return { meses, quando }
}

/** Os `n` meses (yyyy-MM) terminando em `mes`, do mais antigo pro mais recente. */
export function mesesAte(mes: string, n: number) {
  const [ano, m] = mes.split('-').map(Number)
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(Date.UTC(ano, m - 1 - (n - 1 - i), 1))
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
  })
}

export interface HistoricoMes {
  mes: string // yyyy-MM
  entrou: number
  saiu: number
}

/**
 * Salário Fantasma: a renda média dos meses com movimento vira um salário fixo.
 * Meses antes do primeiro lançamento não entram na média (o usuário ainda não usava o app).
 */
export function salarioFantasma(historico: HistoricoMes[]) {
  const inicio = historico.findIndex((h) => h.entrou > 0 || h.saiu > 0)
  const ativos = inicio === -1 ? [] : historico.slice(inicio)
  const salario = ativos.length ? ativos.reduce((a, h) => a + h.entrou, 0) / ativos.length : 0
  return { meses: ativos, salario }
}
