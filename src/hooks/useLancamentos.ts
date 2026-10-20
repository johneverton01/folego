import {
	queryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { mesAtual } from "@/lib/finance";
import { createLancamento, getLancamentosDoMes } from "@/lib/lancamentos";
import type { CreateLancamentoInput } from "@/lib/validations/finance";

export const lancamentosDoMesQueryOptions = (mes = mesAtual()) =>
	queryOptions({
		queryKey: ["lancamentos", mes],
		queryFn: () => getLancamentosDoMes({ data: { mes } }),
	});

export function useLancamentosDoMes(mes?: string) {
	return useSuspenseQuery(lancamentosDoMesQueryOptions(mes));
}

export function useCreateLancamento() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateLancamentoInput) => createLancamento({ data }),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["lancamentos"] }),
	});
}
