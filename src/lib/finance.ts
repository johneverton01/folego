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

const moneyExatoFormatter = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Com centavos: para a lista, onde o valor precisa bater com o que foi digitado. */
export const moneyExato = (n: number) => `R$ ${moneyExatoFormatter.format(n)}`

/** Valor com sinal explícito, pra não depender só da cor: `+R$ 800`, `-R$ 200`. */
export const moneyComSinal = (n: number, formatar = money) =>
  n === 0 ? formatar(0) : `${n > 0 ? '+' : '-'}${formatar(Math.abs(n))}`

export interface Resumo {
  entrou: number
  saiu: number
  sobrou: number
}

export function resumo(lancamentos: Lancamento[]): Resumo {
  const entrou = soma(lancamentos.filter((l) => l.tipo === 'entrada'))
  const saiu = soma(lancamentos.filter((l) => l.tipo === 'saida'))
  return { entrou, saiu, sobrou: entrou - saiu }
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

export interface Folego {
  saldoInformado: boolean
  reserva: number
  custoMensal: number
  /** Meses completos na média do custo; 0 quando o custo vem do mês atual. */
  mesesNaMedia: number
  /** `null` sem nenhuma saída: não há gasto pra dividir a reserva. */
  folegoMeses: number | null
  cobreProximoMes: boolean
  /** Reserva menos o necessário até o fim do mês seguinte; negativo é o que falta. */
  folgaProximoMes: number
  nomeMesAtual: string
  nomeProximoMes: string
  semaforo: Semaforo
}

/**
 * Fôlego = reserva / custo mensal. A métrica central pra renda irregular.
 * `historico` termina no mês atual; `entrou` e `saiu` são os totais até ele.
 */
export function calcularFolego({
  saldoInicial,
  entrou,
  saiu,
  historico,
}: {
  saldoInicial: number | null
  entrou: number
  saiu: number
  historico: HistoricoMes[]
}): Folego {
  const atual = historico[historico.length - 1]
  const { meses: completos } = salarioFantasma(historico.slice(0, -1))
  const media = completos.length ? completos.reduce((a, h) => a + h.saiu, 0) / completos.length : 0

  const reserva = (saldoInicial ?? 0) + entrou - saiu
  // Mês acima da média já é o novo custo: melhor pecar pelo excesso de cautela.
  const custoMensal = Math.max(media, atual.saiu)
  const folegoMeses = custoMensal > 0 ? Math.max(0, reserva) / custoMensal : null

  // O mês seguinte só começa depois das contas que ainda faltam neste.
  const restanteDoMes = Math.max(0, custoMensal - atual.saiu)
  const folgaProximoMes = reserva - (restanteDoMes + custoMensal)
  const cobreProximoMes = folgaProximoMes >= 0

  const mes = Number(atual.mes.slice(5))
  const semaforo: Semaforo = !cobreProximoMes ? 'hot' : (folegoMeses ?? 0) >= 3 ? 'ok' : 'warn'
  return {
    saldoInformado: saldoInicial !== null,
    reserva,
    custoMensal,
    mesesNaMedia: custoMensal > media ? 0 : completos.length,
    folegoMeses,
    cobreProximoMes,
    folgaProximoMes,
    nomeMesAtual: MESES[mes - 1],
    nomeProximoMes: MESES[mes % 12],
    semaforo,
  }
}

export const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
] as const

/** Período da tela de histórico; `mes` nulo significa o ano inteiro. */
export interface Periodo {
  ano: number
  mes: number | null
}

/** Sem nada na URL, o histórico abre no mês atual. `'todos'` é o ano inteiro. */
export function periodoDoHistorico({ ano, mes }: { ano?: number; mes?: number | 'todos' }): Periodo {
  const [anoAtual, mesCorrente] = mesAtual().split('-').map(Number)
  return { ano: ano ?? anoAtual, mes: mes === 'todos' ? null : (mes ?? mesCorrente) }
}

export const nomePeriodo = ({ ano, mes }: Periodo) => (mes ? `${MESES[mes - 1]} de ${ano}` : `${ano}`)

/** `2026-10`, para comparar meses como texto. */
export const chaveMes = (ano: number, mes: number) => `${ano}-${String(mes).padStart(2, '0')}`

export function frasePeriodo(lancamentos: Lancamento[], periodo: Periodo) {
  const nome = nomePeriodo(periodo)
  if (lancamentos.length === 0) return `Você ainda não tem lançamentos em ${nome}.`
  const { entrou, saiu, sobrou } = resumo(lancamentos)
  const fim = sobrou > 0 ? `sobraram ${money(sobrou)}` : sobrou < 0 ? `faltaram ${money(-sobrou)}` : 'não sobrou nada'
  return `Você está vendo ${nome}: entrou ${money(entrou)}, saiu ${money(saiu)} e ${fim}.`
}

/** Explica o recorte aplicado pelos filtros; `null` quando não há filtro. */
export function fraseFiltros(filtrados: Lancamento[], tipo?: Tipo, cat?: string) {
  if (!tipo && !cat) return null
  const alvo = [tipo && (tipo === 'entrada' ? 'entradas' : 'saídas'), cat].filter(Boolean).join(' em ')
  const n = filtrados.length
  const quantos = `${n} ${n === 1 ? 'lançamento' : 'lançamentos'}`
  // Sem tipo, somar entradas com saídas não diria nada útil.
  return `Mostrando só ${alvo}: ${quantos}${tipo ? `, somando ${money(soma(filtrados))}` : ''}.`
}

/** Agrupa lançamentos já ordenados: por dia dentro do mês, por mês no ano inteiro. */
export function agruparLancamentos(lancamentos: Lancamento[], porMes: boolean) {
  const grupos = new Map<string, { titulo: string; lancamentos: Lancamento[] }>()
  for (const l of lancamentos) {
    const chave = porMes ? l.data.slice(0, 7) : l.data
    const [ano, mes, dia] = l.data.split('-').map(Number)
    const titulo = porMes ? nomePeriodo({ ano, mes }) : `${dia} de ${MESES[mes - 1]}`
    const grupo = grupos.get(chave) ?? { titulo, lancamentos: [] }
    grupo.lancamentos.push(l)
    grupos.set(chave, grupo)
  }
  return [...grupos.values()]
}
