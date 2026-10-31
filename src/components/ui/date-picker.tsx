import { cn } from "cn";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
	value?: Date;
	onChange?: (date: Date | undefined) => void;
	placeholder?: string;
	id?: string;
}

export function DatePicker({
	value,
	onChange,
	placeholder = "Escolha uma data",
	id,
}: DatePickerProps) {
	const [internalDate, setInternalDate] = useState<Date>();
	const isControlled = value !== undefined || onChange !== undefined;
	const date = isControlled ? value : internalDate;

	function handleSelect(next: Date | undefined) {
		if (!isControlled) setInternalDate(next);
		onChange?.(next);
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					id={id}
					type="button"
					variant="outline"
					data-empty={!date}
					className={cn(
						"group h-11 w-full justify-start gap-2 rounded-control border-line bg-surface px-3.5 text-left font-sans text-base font-normal text-ink shadow-none transition-[border-color,box-shadow] duration-150 hover:bg-surface hover:text-ink dark:border-line dark:bg-surface dark:hover:bg-surface",
						"focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-wash",
						"aria-expanded:border-accent aria-expanded:ring-[3px] aria-expanded:ring-accent-wash",
						"data-[empty=true]:text-ink-faint motion-reduce:transition-none",
					)}
				>
					<CalendarIcon
						aria-hidden="true"
						className="text-ink-faint transition-colors group-focus-visible:text-accent group-aria-expanded:text-accent"
					/>
					{date ? (
						format(date, "PPP", { locale: ptBR })
					) : (
						<span>{placeholder}</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={date}
					onSelect={handleSelect}
					locale={ptBR}
				/>
			</PopoverContent>
		</Popover>
	);
}
