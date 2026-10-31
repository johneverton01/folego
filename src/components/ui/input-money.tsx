import { cn } from "cn";
import type * as React from "react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

type InputMoneyProps = Omit<
	React.ComponentProps<"input">,
	"type" | "value" | "onChange"
> & {
	/** Valor em centavos. */
	value: number;
	onChange: (cents: number) => void;
	containerClassName?: string;
};

const brl = new Intl.NumberFormat("pt-BR", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

// Máscara de dinheiro: os dígitos digitados são tratados como centavos.
function formatCents(cents: number) {
	return cents === 0 ? "" : brl.format(cents / 100);
}

function parseCents(value: string) {
	return Number(value.replace(/\D/g, "").slice(0, 12) || 0);
}

function InputMoney({
	className,
	containerClassName,
	disabled,
	placeholder = "0,00",
	value,
	onChange,
	...props
}: InputMoneyProps) {
	return (
		<InputGroup
			data-disabled={disabled}
			className={cn(
				"h-11 rounded-control border-line bg-surface shadow-none transition-[border-color,box-shadow] duration-150 dark:bg-surface",

				// Foco: borda de marca + anel suave (accent-wash).
				"has-[[data-slot=input-group-control]:focus-visible]:border-accent has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-accent-wash",

				// Erro: semáforo vermelho.
				"has-[[data-slot][aria-invalid=true]]:border-danger has-[[data-slot][aria-invalid=true]]:ring-[3px] has-[[data-slot][aria-invalid=true]]:ring-danger-wash dark:has-[[data-slot][aria-invalid=true]]:ring-danger-wash",

				"data-[disabled=true]:bg-surface-soft data-[disabled=true]:opacity-60",
				"motion-reduce:transition-none",
				containerClassName,
			)}
		>
			<InputGroupAddon
				className={cn(
					"pl-3.5 font-sans text-base font-medium text-ink-faint transition-colors",
					"group-has-[[data-slot=input-group-control]:focus-visible]/input-group:text-accent",
					"group-has-[[data-slot][aria-invalid=true]]/input-group:text-danger",
				)}
			>
				R$
			</InputGroupAddon>
			<InputGroupInput
				type="text"
				inputMode="numeric"
				autoComplete="off"
				disabled={disabled}
				placeholder={placeholder}
				value={formatCents(value)}
				onChange={(e) => onChange(parseCents(e.target.value))}
				className={cn(
					"h-full font-sans text-base tabular-nums text-ink placeholder:text-ink-faint selection:bg-accent-wash selection:text-ink md:text-base",
					className,
				)}
				{...props}
			/>
		</InputGroup>
	);
}

export { InputMoney };
export type { InputMoneyProps };
