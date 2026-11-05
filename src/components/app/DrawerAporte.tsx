import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldError } from "@/components/auth/FormFeedback";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { InputMoney } from "@/components/ui/input-money";
import { Label } from "@/components/ui/label";
import { useCreateAporte } from "@/hooks/useMetas";
import type { Meta } from "@/lib/finance";
import { type AporteValues, aporteSchema } from "@/lib/validations/finance";

interface DrawerAporteProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	meta: Meta | null;
}

export function DrawerAporte({ open, onOpenChange, meta }: DrawerAporteProps) {
	const createAporte = useCreateAporte();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<AporteValues>({
		resolver: zodResolver(aporteSchema),
		defaultValues: { valor: 0, data: new Date() },
		mode: "onTouched",
	});

	useEffect(() => {
		if (open) reset({ valor: 0, data: new Date() });
	}, [open, reset]);

	async function onSubmit(values: AporteValues) {
		if (!meta) return;
		try {
			await createAporte.mutateAsync({
				metaId: meta.id,
				valor: values.valor,
				data: format(values.data, "yyyy-MM-dd"),
			});
			toast.success("Valor guardado");
			onOpenChange(false);
		} catch {
			toast.error("Não foi possível salvar. Tente novamente.");
		}
	}

	return (
		<Drawer open={open} onOpenChange={onOpenChange} direction="right">
			<DrawerContent className="bg-paper">
				<form
					noValidate
					onSubmit={handleSubmit(onSubmit)}
					className="flex h-full flex-col"
				>
					<DrawerHeader>
						<DrawerTitle>Guardar em “{meta?.nome}”</DrawerTitle>
						<DrawerDescription>
							Registre quanto você separou. O valor continua contando na sua
							reserva.
						</DrawerDescription>
					</DrawerHeader>

					<div className="flex-1 space-y-4 overflow-y-auto px-4">
						<div className="space-y-2">
							<Label htmlFor="aporte-valor">Valor</Label>
							<Controller
								control={control}
								name="valor"
								render={({ field }) => (
									<InputMoney
										id="aporte-valor"
										disabled={isSubmitting}
										aria-invalid={!!errors.valor}
										aria-describedby={
											errors.valor ? "aporte-valor-error" : undefined
										}
										ref={field.ref}
										name={field.name}
										onBlur={field.onBlur}
										value={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
							<FieldError
								id="aporte-valor-error"
								message={errors.valor?.message}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="aporte-data">Data</Label>
							<Controller
								control={control}
								name="data"
								render={({ field }) => (
									<DatePicker
										id="aporte-data"
										value={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
							<FieldError
								id="aporte-data-error"
								message={errors.data?.message}
							/>
						</div>
					</div>

					<DrawerFooter className="grid grid-cols-2">
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting && (
								<LoaderCircleIcon className="animate-spin" aria-hidden="true" />
							)}
							Salvar
						</Button>
						<DrawerClose asChild>
							<Button
								type="button"
								variant="outline"
								className="border-line bg-surface text-ink hover:bg-surface-soft hover:text-ink dark:border-line dark:bg-surface dark:hover:bg-surface-soft"
							>
								Cancelar
							</Button>
						</DrawerClose>
					</DrawerFooter>
				</form>
			</DrawerContent>
		</Drawer>
	);
}
