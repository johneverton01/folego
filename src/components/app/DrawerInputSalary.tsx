import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { LoaderCircleIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldError } from "@/components/auth/FormFeedback";
import { Button } from "@/components/ui/button";
import { CategoryPicker } from "@/components/ui/category-picker";
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
import { InputDescription } from "@/components/ui/input-description";
import { InputMoney } from "@/components/ui/input-money";
import { Label } from "@/components/ui/label";
import { useCreateLancamento } from "@/hooks/useLancamentos";
import { CATEGORIAS } from "@/lib/finance";
import {
	type LancamentoValues,
	lancamentoSchema,
} from "@/lib/validations/finance";

interface DrawerInputSalaryProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DrawerInputSalary({
	open,
	onOpenChange,
}: DrawerInputSalaryProps) {
	const createLancamento = useCreateLancamento();

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<LancamentoValues>({
		resolver: zodResolver(lancamentoSchema),
		defaultValues: { desc: "", valor: 0, cat: "", data: new Date() },
		mode: "onTouched",
	});

	function handleOpenChange(next: boolean) {
		if (!next) reset({ desc: "", valor: 0, cat: "", data: new Date() });
		onOpenChange(next);
	}

	async function onSubmit(values: LancamentoValues) {
		try {
			await createLancamento.mutateAsync({
				desc: values.desc,
				valor: values.valor,
				cat: values.cat,
				tipo: "entrada",
				data: format(values.data, "yyyy-MM-dd"),
			});
			toast.success("Entrada registrada");
			handleOpenChange(false);
		} catch {
			toast.error("Não foi possível salvar. Tente novamente.");
		}
	}

	return (
		<Drawer open={open} onOpenChange={handleOpenChange} direction="right">
			<DrawerContent className="bg-paper">
				<form
					noValidate
					onSubmit={handleSubmit(onSubmit)}
					className="flex h-full flex-col"
				>
					<DrawerHeader>
						<DrawerTitle>Nova entrada</DrawerTitle>
						<DrawerDescription>
							Informe a descrição, o valor recebido, a categoria e a data.
						</DrawerDescription>
					</DrawerHeader>

					<div className="flex-1 space-y-4 overflow-y-auto px-4">
						<div className="space-y-2">
							<Label htmlFor="salary-desc">Descrição</Label>
							<InputDescription
								id="salary-desc"
								disabled={isSubmitting}
								placeholder="Ex.: Contrato Acme"
								aria-invalid={!!errors.desc}
								aria-describedby={errors.desc ? "salary-desc-error" : undefined}
								{...register("desc")}
							/>
							<FieldError
								id="salary-desc-error"
								message={errors.desc?.message}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="salary-value">Valor</Label>
							<Controller
								control={control}
								name="valor"
								render={({ field }) => (
									<InputMoney
										id="salary-value"
										disabled={isSubmitting}
										aria-invalid={!!errors.valor}
										aria-describedby={
											errors.valor ? "salary-value-error" : undefined
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
								id="salary-value-error"
								message={errors.valor?.message}
							/>
						</div>

						<div className="space-y-2">
							<Label id="salary-cat-label">Categoria</Label>
							<Controller
								control={control}
								name="cat"
								render={({ field }) => (
									<CategoryPicker
										options={CATEGORIAS.entrada}
										disabled={isSubmitting}
										aria-labelledby="salary-cat-label"
										aria-invalid={!!errors.cat}
										aria-describedby={
											errors.cat ? "salary-cat-error" : undefined
										}
										ref={field.ref}
										onBlur={field.onBlur}
										value={field.value}
										onValueChange={field.onChange}
									/>
								)}
							/>
							<FieldError id="salary-cat-error" message={errors.cat?.message} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="salary-date">Data</Label>
							<Controller
								control={control}
								name="data"
								render={({ field }) => (
									<DatePicker
										id="salary-date"
										value={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
							<FieldError
								id="salary-date-error"
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
