import { money, progressoMeta } from "@/lib/finance";
import type { Meta, Resumo } from "@/lib/finance";

const RESPONSE_SCHEMA = `{
  "feasibility": {
    "status": "viable" | "needs_adjustment" | "unfeasible",
    "content": "<Análise objetiva sobre se a meta é atingível no prazo com o valor disponível. Mencione os números relevantes.>"
  },
  "diagnosis": {
    "content": "<Diagnóstico focado no comprometimento do orçamento: quanto % da renda está comprometida com gastos e dívidas, e o que isso representa para a saúde financeira.>"
  },
  "suggestions": {
    "items": ["<Sugestão prática e concreta para reduzir gastos ou reorganizar o orçamento>"]
  },
  "extraIncome": {
    "items": ["<Ideia prática para gerar renda extra compatível com a realidade brasileira>"]
  },
  "investment": {
    "items": ["<Sugestão de investimento acessível para o perfil apresentado, com foco em atingir a meta>"]
  },
  "motivation": {
    "content": "<Mensagem final motivacional e personalizada, citando a meta pelo nome.>"
  }
}`

export interface AIPromptInput {
	meta: Pick<Meta, "nome" | "valorAlvo" | "valorMensal" | "guardado">
	/** Entrou/saiu/sobrou do mês atual, de `resumo(lancamentosDoMes)`. */
	resumoMes: Resumo
}

export function buildAIPrompt({ meta, resumoMes }: AIPromptInput) {
	const progresso = progressoMeta(meta)
	const saldoAposReserva = resumoMes.sobrou - meta.valorMensal

	return `Você é um educador financeiro especializado em finanças pessoais.
    Analise os dados abaixo e gere um diagnóstico financeiro personalizado com linguagem clara, didática e encorajadora,
    voltado para pessoas sem conhecimento financeiro. O diagnóstico será exibido diretamente ao usuário no app,
    fale sempre em segunda pessoa ("você tem...", "sua meta...").

    Dados do mês atual:
    - Entradas do mês: ${money(resumoMes.entrou)}
    - Saídas do mês: ${money(resumoMes.saiu)}
    - Valor disponível no mês (entradas menos saídas): ${money(resumoMes.sobrou)}

    Dados da meta:
    - Meta: ${meta.nome}
    - Custo da meta: ${money(meta.valorAlvo)}
    - Já guardado para a meta: ${money(meta.guardado)}
    - Falta guardar: ${money(progresso.falta)}
    - Economia mensal reservada para essa meta: ${money(meta.valorMensal)}
    - Prazo no ritmo atual: ${progresso.concluida ? "meta já concluída" : `${progresso.meses} ${progresso.meses === 1 ? "mês" : "meses"}`}
    - Saldo do mês após reservar o valor da meta: ${money(saldoAposReserva)}

    Retorne APENAS um JSON válido, sem texto adicional, sem blocos de código, neste formato exato:

    ${RESPONSE_SCHEMA}

    Regras:
    - Todos os textos em português do Brasil
    - Máximo de 4 itens por lista
    - Seja específico ao citar valores calculados
    - Não repita informações entre seções
    - Nunca use markdown dentro dos valores do JSON
    - Para o campo "feasibility.status", use os seguintes critérios:
      - "viable": saldo do mês após reservar o valor da meta é maior ou igual a 0
      - "needs_adjustment": saldo negativo de até 20% da economia mensal reservada para a meta
      - "unfeasible": saldo negativo superior a 20% da economia mensal reservada para a meta`
}
