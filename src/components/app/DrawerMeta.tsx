import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldError } from "@/components/auth/FormFeedback";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { InputDescription } from "@/components/ui/input-description";
import { InputMoney } from "@/components/ui/input-money";
import { Label } from "@/components/ui/label";
import { useCreateMeta, useDeleteMeta, useUpdateMeta } from "@/hooks/useMetas";
import { frasePrazo, type Meta, progressoMeta } from "@/lib/finance";
import { type MetaValues, metaSchema } from "@/lib/validations/finance";

function valoresIniciais(meta?: Meta | null): MetaValues {
	if (!meta) return { nome: "", valorAlvo: 0, valorMensal: 0 };
	return {
		nome: meta.nome,
		// O formulário trabalha em centavos; a API devolve reais.
		valorAlvo: Math.round(meta.valorAlvo * 100),
		valorMensal: Math.round(meta.valorMensal * 100),
	};
}

function previsao(valorAlvo: number, valorMensal: number, guardado: number) {
	if (valorAlvo <= 0 || valorMensal <= 0) return null;
	const progresso = progressoMeta({
		valorAlvo: valorAlvo / 100,
		valorMensal: valorMensal / 100,
		guardado,
	});
	return progresso.concluida ? "Meta alcançada" : frasePrazo(progresso);
}

interface DrawerMetaProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	meta?: Meta | null;
}

export function DrawerMeta({ open, onOpenChange, meta }: DrawerMetaProps) {
	const createMeta = useCreateMeta();
	const updateMeta = useUpdateMeta();
	const deleteMeta = useDeleteMeta();
	const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

	const {
		register,
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<MetaValues>({
		resolver: zodResolver(metaSchema),
		defaultValues: valoresIniciais(meta),
		mode: "onTouched",
	});

	useEffect(() => {
		if (open) reset(valoresIniciais(meta));
	}, [open, meta, reset]);

	const frasePrevisao = previsao(
		watch("valorAlvo"),
		watch("valorMensal"),
		meta?.guardado ?? 0,
	);

	async function onSubmit(values: MetaValues) {
		try {
			if (meta) {
				await updateMeta.mutateAsync({ id: meta.id, ...values });
				toast.success("Alterações salvas");
			} else {
				await createMeta.mutateAsync(values);
				toast.success("Meta criada");
			}
			onOpenChange(false);
		} catch {
			toast.error("Não foi possível salvar. Tente novamente.");
		}
	}

	async function excluir() {
		if (!meta) return;
		try {
			await deleteMeta.mutateAsync(meta.id);
			toast.success("Meta excluída");
			setConfirmandoExclusao(false);
			onOpenChange(false);
		} catch {
			toast.error("Não foi possível excluir. Tente novamente.");
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
						<DrawerTitle>{meta ? "Editar meta" : "Nova meta"}</DrawerTitle>
						<DrawerDescription>
							Informe quanto você quer juntar e quanto consegue guardar por mês.
						</DrawerDescription>
					</DrawerHeader>

					<div className="flex-1 space-y-4 overflow-y-auto px-4">
						<div className="space-y-2">
							<Label htmlFor="meta-nome">Nome</Label>
							<InputDescription
								id="meta-nome"
								disabled={isSubmitting}
								placeholder="Ex.: Viagem pro Japão"
								aria-invalid={!!errors.nome}
								aria-describedby={errors.nome ? "meta-nome-error" : undefined}
								{...register("nome")}
							/>
							<FieldError id="meta-nome-error" message={errors.nome?.message} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="meta-alvo">Valor da meta</Label>
							<Controller
								control={control}
								name="valorAlvo"
								render={({ field }) => (
									<InputMoney
										id="meta-alvo"
										disabled={isSubmitting}
										aria-invalid={!!errors.valorAlvo}
										aria-describedby={
											errors.valorAlvo ? "meta-alvo-error" : undefined
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
								id="meta-alvo-error"
								message={errors.valorAlvo?.message}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="meta-mensal">Guardar por mês</Label>
							<Controller
								control={control}
								name="valorMensal"
								render={({ field }) => (
									<InputMoney
										id="meta-mensal"
										disabled={isSubmitting}
										aria-invalid={!!errors.valorMensal}
										aria-describedby={
											errors.valorMensal ? "meta-mensal-error" : undefined
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
								id="meta-mensal-error"
								message={errors.valorMensal?.message}
							/>
						</div>

						{frasePrevisao && (
							<p
								aria-live="polite"
								className="rounded-control border border-line bg-surface-soft p-4 text-sm font-medium"
							>
								{frasePrevisao}
							</p>
						)}
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
						{meta && (
							<Button
								type="button"
								variant="ghost"
								disabled={isSubmitting}
								className="col-span-2 text-danger hover:bg-danger-wash hover:text-danger dark:hover:bg-danger-wash"
								onClick={() => setConfirmandoExclusao(true)}
							>
								<Trash2Icon aria-hidden="true" />
								Excluir meta
							</Button>
						)}
					</DrawerFooter>
				</form>

				<AlertDialog
					open={confirmandoExclusao}
					onOpenChange={setConfirmandoExclusao}
				>
					<AlertDialogContent>
						<AlertDialogTitle>Excluir “{meta?.nome}”?</AlertDialogTitle>
						<AlertDialogDescription>
							Essa ação é definitiva: a meta e os valores registrados nela somem
							e não dá para recuperar. Seus lançamentos e sua reserva não mudam.
						</AlertDialogDescription>
						<AlertDialogFooter>
							<AlertDialogCancel>Manter</AlertDialogCancel>
							<Button
								className="bg-danger hover:bg-danger hover:brightness-105"
								disabled={deleteMeta.isPending}
								onClick={excluir}
							>
								{deleteMeta.isPending && (
									<LoaderCircleIcon
										className="animate-spin"
										aria-hidden="true"
									/>
								)}
								Excluir
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</DrawerContent>
		</Drawer>
	);
}
