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
					className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
				>
					<CalendarIcon />
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
