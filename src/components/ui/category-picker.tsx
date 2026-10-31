import { cn } from "cn";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import type * as React from "react";

type CategoryPickerProps = Omit<
	React.ComponentProps<typeof RadioGroupPrimitive.Root>,
	"onChange" | "orientation"
> & {
	options: readonly string[];
};

function CategoryPicker({ options, className, ...props }: CategoryPickerProps) {
	return (
		<RadioGroupPrimitive.Root
			data-slot="category-picker"
			className={cn("flex flex-wrap gap-2", className)}
			{...props}
		>
			{options.map((option) => (
				<RadioGroupPrimitive.Item
					key={option}
					value={option}
					className={cn(
						"h-10 cursor-pointer rounded-pill border border-line bg-surface px-3.5 font-sans text-sm text-ink-soft outline-none transition-[border-color,background-color,color,box-shadow] duration-150",
						"hover:border-accent hover:text-ink",

						// Foco: mesmo anel dos inputs.
						"focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-wash",

						// Selecionado: fundo suave de marca.
						"data-[state=checked]:border-accent data-[state=checked]:bg-accent-wash data-[state=checked]:font-medium data-[state=checked]:text-accent-deep",

						"disabled:cursor-not-allowed disabled:bg-surface-soft disabled:opacity-60",
						"motion-reduce:transition-none",
					)}
				>
					{option}
				</RadioGroupPrimitive.Item>
			))}
		</RadioGroupPrimitive.Root>
	);
}

export { CategoryPicker };
export type { CategoryPickerProps };
