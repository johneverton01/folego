import { getLocale, setLocale } from "@/paraglide/runtime";

const LABELS: Record<string, string> = {
	"pt-br": "PT",
	en: "EN",
};

export function LocaleToggle() {
	const locale = getLocale();
	const next = locale === "pt-br" ? "en" : "pt-br";

	return (
		<button
			type="button"
			onClick={() => setLocale(next)}
			aria-label={
				locale === "pt-br" ? "Switch to English" : "Mudar para português"
			}
			className="grid size-9 place-items-center rounded-tab border border-line text-xs font-semibold tracking-wide text-ink-soft transition hover:bg-surface-soft hover:text-ink"
		>
			{LABELS[locale]}
		</button>
	);
}
