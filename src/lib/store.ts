import { create } from 'zustand'

// Lançamentos agora vêm do banco (ver `src/lib/lancamentos.ts`); aqui fica só o que ainda não tem backend.
interface FinanceState {
  reserva: number
}

export const useFinance = create<FinanceState>(() => ({
  reserva: 15870,
}))
