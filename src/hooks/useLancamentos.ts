import {
	queryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { mesAtual } from "@/lib/finance";
import {
	createLancamento,
	getHistoricoMensal,
	getLancamentosDoMes,
} from "@/lib/lancamentos";
import type { CreateLancamentoInput } from "@/lib/validations/finance";

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

export function useCreateLancamento() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateLancamentoInput) => createLancamento({ data }),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["lancamentos"] }),
	});
}
