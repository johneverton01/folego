import { cn } from "cn";
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import * as React from "react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";

type InputPasswordProps = Omit<React.ComponentProps<"input">, "type"> & {
	containerClassName?: string;
};

function InputPassword({
	className,
	containerClassName,
	disabled,
	placeholder = "Sua senha",
	autoComplete = "current-password",
	...props
}: InputPasswordProps) {
	const [visible, setVisible] = React.useState(false);

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
				<LockIcon aria-hidden="true" />
			</InputGroupAddon>
			<InputGroupInput
				type={visible ? "text" : "password"}
				autoComplete={autoComplete}
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
			<InputGroupAddon align="inline-end" className="pr-2">
				<InputGroupButton
					size="icon-sm"
					disabled={disabled}
					aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
					aria-pressed={visible}
					onClick={() => setVisible((v) => !v)}
					className={cn(
						"rounded-tab text-ink-faint transition-colors hover:bg-accent-wash hover:text-ink dark:hover:bg-accent-wash",
						"focus-visible:text-accent focus-visible:ring-[3px] focus-visible:ring-accent-wash",
						"motion-reduce:transition-none",
					)}
				>
					{visible ? (
						<EyeOffIcon aria-hidden="true" />
					) : (
						<EyeIcon aria-hidden="true" />
					)}
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	);
}

export { InputPassword };
export type { InputPasswordProps };
