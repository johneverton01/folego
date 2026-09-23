import { create } from 'zustand'
import { type Lancamento } from './finance'

// Semente de exemplo (troque por dados reais / server functions do Start depois).
const SEED: Lancamento[] = [
  { id: '1', desc: 'Contrato Acme', valor: 4500, cat: 'Contrato PJ', tipo: 'entrada', data: '2026-09-05' },
  { id: '2', desc: 'Contrato Beta', valor: 2500, cat: 'Contrato PJ', tipo: 'entrada', data: '2026-09-10' },
  { id: '3', desc: 'Freela landing', valor: 1500, cat: 'Freela', tipo: 'entrada', data: '2026-09-18' },
  { id: '4', desc: 'Aluguel + contas', valor: 2400, cat: 'Casa', tipo: 'saida', data: '2026-09-05' },
  { id: '5', desc: 'Mercado e delivery', valor: 1500, cat: 'Comida', tipo: 'saida', data: '2026-09-12' },
  { id: '6', desc: 'DAS + contador', valor: 1200, cat: 'Impostos/PJ', tipo: 'saida', data: '2026-09-15' },
  { id: '7', desc: 'Lazer e rolês', valor: 1000, cat: 'Lazer', tipo: 'saida', data: '2026-09-20' },
  { id: '8', desc: 'Diversos', valor: 800, cat: 'Outros', tipo: 'saida', data: '2026-09-22' },
]

interface FinanceState {
  lancamentos: Lancamento[]
  reserva: number
  add: (l: Omit<Lancamento, 'id'>) => void
}

export const useFinance = create<FinanceState>((set) => ({
  lancamentos: SEED,
  reserva: 15870,
  add: (l) =>
    set((s) => ({ lancamentos: [...s.lancamentos, { ...l, id: crypto.randomUUID() }] })),
}))
