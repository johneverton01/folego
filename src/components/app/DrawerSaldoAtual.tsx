import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldError } from "@/components/auth/FormFeedback";
import { Button } from "@/components/ui/button";
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
import { useUpdateSaldoAtual } from "@/hooks/useLancamentos";
import {
	type SaldoAtualValues,
	saldoAtualSchema,
} from "@/lib/validations/finance";

interface DrawerSaldoAtualProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Valor já preenchido, em reais. */
	saldoAtual: number;
}

export function DrawerSaldoAtual({
	open,
	onOpenChange,
	saldoAtual,
}: DrawerSaldoAtualProps) {
	const updateSaldoAtual = useUpdateSaldoAtual();
	// O formulário trabalha em centavos; a API devolve reais.
	const centavos = Math.round(saldoAtual * 100);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<SaldoAtualValues>({
		resolver: zodResolver(saldoAtualSchema),
		defaultValues: { saldoAtual: centavos },
		mode: "onTouched",
	});

	useEffect(() => {
		if (open) reset({ saldoAtual: centavos });
	}, [open, centavos, reset]);

	async function onSubmit(values: SaldoAtualValues) {
		try {
			await updateSaldoAtual.mutateAsync(values.saldoAtual);
			toast.success("Saldo salvo");
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
						<DrawerTitle>Quanto você tem em conta hoje?</DrawerTitle>
						<DrawerDescription>
							Some o que está nas suas contas agora. Daqui pra frente, suas
							entradas e saídas atualizam esse valor.
						</DrawerDescription>
					</DrawerHeader>

					<div className="flex-1 space-y-2 overflow-y-auto px-4">
						<Label htmlFor="saldo-atual">Valor</Label>
						<Controller
							control={control}
							name="saldoAtual"
							render={({ field }) => (
								<InputMoney
									id="saldo-atual"
									disabled={isSubmitting}
									aria-invalid={!!errors.saldoAtual}
									aria-describedby={
										errors.saldoAtual ? "saldo-atual-error" : undefined
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
							id="saldo-atual-error"
							message={errors.saldoAtual?.message}
						/>
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
