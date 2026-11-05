import {
	queryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import {
	createAporte,
	createMeta,
	deleteAporte,
	deleteMeta,
	getMeta,
	getMetas,
	updateMeta,
} from "@/lib/metas";
import type {
	CreateAporteInput,
	MetaValues,
	UpdateMetaInput,
} from "@/lib/validations/finance";

// Fora de ["lancamentos"]: guardar pra uma meta não muda a reserva nem o fôlego.
export const metasQueryOptions = () =>
	queryOptions({
		queryKey: ["metas"],
		queryFn: () => getMetas(),
	});

export function useMetas() {
	return useSuspenseQuery(metasQueryOptions());
}

// Prefixo ["metas"] em comum: invalidar a lista também invalida a meta aberta.
export const metaQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["metas", id],
		queryFn: () => getMeta({ data: { id } }),
	});

export function useMeta(id: string) {
	return useSuspenseQuery(metaQueryOptions(id));
}

export function useCreateMeta() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: MetaValues) => createMeta({ data }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["metas"] }),
	});
}

export function useUpdateMeta() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateMetaInput) => updateMeta({ data }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["metas"] }),
	});
}

export function useDeleteMeta() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteMeta({ data: { id } }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["metas"] }),
	});
}

export function useCreateAporte() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateAporteInput) => createAporte({ data }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["metas"] }),
	});
}

export function useDeleteAporte() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteAporte({ data: { id } }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["metas"] }),
	});
}
