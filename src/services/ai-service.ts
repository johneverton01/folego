import { createServerFn } from "@tanstack/react-start";
import { requireUserId } from "@/lib/sessao-server";
import { insightSchema } from "@/lib/validations/finance";

interface GeminiResponse {
	candidates: {
		content: {
			parts: { text: string }[];
		};
	}[];
}

export interface InsightDate {
	feasibility: {
		status: "viable" | "needs_adjustment" | "unfeasible";
	};
	diagnosis: {
		content: string;
	};
	suggestions: {
		items: string[];
	};
	extraIncome: {
		items: string[];
	};
	investment: {
		items: string[];
	};
	motivation: {
		content: string;
	};
}

const MODEL_NAME = "gemini-3.8-flash";

function getApiKey() {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) throw new Error("GEMINI_API_KEY is required");
	return apiKey;
}

async function callGeminiAPI(prompt: string): Promise<GeminiResponse> {
	const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-goog-api-key": getApiKey(),
		},
		body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
	});

	if (!response.ok) {
		throw new Error(`Erro na requisição: ${response.status}`);
	}

	return response.json();
}

/** Diagnóstico da IA para uma meta, a partir do prompt já montado no cliente. */
export const getInsight = createServerFn({ method: "POST" })
	.validator(insightSchema)
	.handler(async ({ data: { prompt } }): Promise<InsightDate> => {
		await requireUserId();
		const response = await callGeminiAPI(prompt);
		const json = response.candidates[0].content.parts[0].text;
		return JSON.parse(json);
	});
