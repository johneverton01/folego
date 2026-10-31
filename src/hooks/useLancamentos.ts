import {
	queryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { mesAtual, type Periodo } from "@/lib/finance";
import {
	createLancamento,
	deleteLancamento,
	getFolego,
	getHistoricoMensal,
	getLancamentosDoMes,
	getLancamentosDoPeriodo,
	getResumoAno,
	updateLancamento,
	updateSaldoAtual,
} from "@/lib/lancamentos";
import type {
	CreateLancamentoInput,
	UpdateLancamentoInput,
} from "@/lib/validations/finance";

export const lancamentosDoMesQueryOptions = (mes = mesAtual()) =>
	queryOptions({
		queryKey: ["lancamentos", mes],
		queryFn: () => getLancamentosDoMes({ data: { mes } }),
	});

export function useLancamentosDoMes(mes?: string) {
	return useSuspenseQuery(lancamentosDoMesQueryOptions(mes));
}

// Fica sob ["lancamentos"] pra ser invalidado junto quando um lançamento é criado.
export const historicoMensalQueryOptions = (meses = 6) =>
	queryOptions({
		queryKey: ["lancamentos", "historico", meses],
		queryFn: () => getHistoricoMensal({ data: { meses } }),
	});

export function useHistoricoMensal(meses?: number) {
	return useSuspenseQuery(historicoMensalQueryOptions(meses));
}

export const lancamentosDoPeriodoQueryOptions = ({ ano, mes }: Periodo) =>
	queryOptions({
		queryKey: ["lancamentos", "periodo", ano, mes],
		queryFn: () =>
			getLancamentosDoPeriodo({ data: { ano, mes: mes ?? undefined } }),
	});

export function useLancamentosDoPeriodo(periodo: Periodo) {
	return useSuspenseQuery(lancamentosDoPeriodoQueryOptions(periodo));
}

export const resumoAnoQueryOptions = (ano: number) =>
	queryOptions({
		queryKey: ["lancamentos", "ano", ano],
		queryFn: () => getResumoAno({ data: { ano } }),
	});

export function useResumoAno(ano: number) {
	return useSuspenseQuery(resumoAnoQueryOptions(ano));
}

// Também sob ["lancamentos"]: todo lançamento muda a reserva.
export const folegoQueryOptions = () =>
	queryOptions({
		queryKey: ["lancamentos", "folego"],
		queryFn: () => getFolego(),
	});

export function useFolego() {
	return useSuspenseQuery(folegoQueryOptions());
}

export function useUpdateSaldoAtual() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (saldoAtual: number) =>
			updateSaldoAtual({ data: { saldoAtual } }),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["lancamentos", "folego"] }),
	});
}

export function useCreateLancamento() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateLancamentoInput) => createLancamento({ data }),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["lancamentos"] }),
	});
}

export function useUpdateLancamento() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateLancamentoInput) => updateLancamento({ data }),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["lancamentos"] }),
	});
}

export function useDeleteLancamento() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteLancamento({ data: { id } }),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["lancamentos"] }),
	});
}
