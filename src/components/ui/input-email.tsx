import { cn } from "cn";
import { MailIcon } from "lucide-react";
import type * as React from "react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

type InputEmailProps = Omit<React.ComponentProps<"input">, "type"> & {
	containerClassName?: string;
};

function InputEmail({
	className,
	containerClassName,
	disabled,
	placeholder = "voce@email.com",
	...props
}: InputEmailProps) {
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
					"pl-3.5 text-ink-faint transition-colors",
					"group-has-[[data-slot=input-group-control]:focus-visible]/input-group:text-accent",
					"group-has-[[data-slot][aria-invalid=true]]/input-group:text-danger",
				)}
			>
				<MailIcon aria-hidden="true" />
			</InputGroupAddon>
			<InputGroupInput
				type="email"
				inputMode="email"
				autoComplete="email"
				autoCapitalize="none"
				autoCorrect="off"
				spellCheck={false}
				disabled={disabled}
				placeholder={placeholder}
				className={cn(
					"h-full font-sans text-base text-ink placeholder:text-ink-faint selection:bg-accent-wash selection:text-ink md:text-base",
					className,
				)}
				{...props}
			/>
		</InputGroup>
	);
}

export { InputEmail };
export type { InputEmailProps };
