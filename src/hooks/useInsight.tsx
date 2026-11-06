import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { buildAIPrompt } from "@/data/ai-prompt";
import { lancamentosDoMesQueryOptions } from "@/hooks/useLancamentos";
import { metaQueryOptions } from "@/hooks/useMetas";
import { resumo } from "@/lib/finance";
import { getInsight } from "@/services/ai-service";

export function useInsight(id: string) {
	const { data: meta } = useSuspenseQuery(metaQueryOptions(id));
	const { data: lancamentosDoMes } = useSuspenseQuery(
		lancamentosDoMesQueryOptions(),
	);
	const resumoMes = resumo(lancamentosDoMes);

	return useQuery({
		queryKey: ["insight", id, resumoMes],
		queryFn: () =>
			getInsight({ data: { prompt: buildAIPrompt({ meta, resumoMes }) } }),
	});
}
