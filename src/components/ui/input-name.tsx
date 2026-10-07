import { cn } from "cn";
import { UserIcon } from "lucide-react";
import type * as React from "react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

type InputNameProps = Omit<React.ComponentProps<"input">, "type"> & {
	containerClassName?: string;
};

function InputName({
	className,
	containerClassName,
	disabled,
	placeholder = "Seu nome",
	autoComplete = "name",
	...props
}: InputNameProps) {
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
				<UserIcon aria-hidden="true" />
			</InputGroupAddon>
			<InputGroupInput
				type="text"
				autoComplete={autoComplete}
				autoCapitalize="words"
				autoCorrect="off"
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

export { InputName };
export type { InputNameProps };
