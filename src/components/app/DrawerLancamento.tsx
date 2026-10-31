import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
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
import {
	useCreateLancamento,
	useDeleteLancamento,
	useUpdateLancamento,
} from "@/hooks/useLancamentos";
import { CATEGORIAS, type Lancamento, type Tipo } from "@/lib/finance";
import {
	type LancamentoValues,
	lancamentoSchema,
} from "@/lib/validations/finance";

const TEXTOS = {
	entrada: {
		novo: "Nova entrada",
		editar: "Editar entrada",
		descricao: "Informe a descrição, o valor recebido, a categoria e a data.",
		exemplo: "Ex.: Contrato Acme",
		criado: "Entrada registrada",
	},
	saida: {
		novo: "Nova saída",
		editar: "Editar saída",
		descricao: "Informe a descrição, o valor gasto, a categoria e a data.",
		exemplo: "Ex.: Aluguel",
		criado: "Saída registrada",
	},
} as const;

function valoresIniciais(lancamento?: Lancamento | null): LancamentoValues {
	if (!lancamento) return { desc: "", valor: 0, cat: "", data: new Date() };
	return {
		desc: lancamento.desc,
		// O formulário trabalha em centavos; a API devolve reais.
		valor: Math.round(lancamento.valor * 100),
		cat: lancamento.cat,
		// parseISO lê yyyy-MM-dd como data local: `new Date` voltaria um dia no Brasil.
		data: parseISO(lancamento.data),
	};
}

interface DrawerLancamentoProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	tipo: Tipo;
	/** Quando presente, o drawer edita esse lançamento em vez de criar um novo. */
	lancamento?: Lancamento | null;
}

export function DrawerLancamento({
	open,
	onOpenChange,
	tipo,
	lancamento,
}: DrawerLancamentoProps) {
	const createLancamento = useCreateLancamento();
	const updateLancamento = useUpdateLancamento();
	const deleteLancamento = useDeleteLancamento();
	const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

	const textos = TEXTOS[tipo];
	const categorias =
		lancamento && !CATEGORIAS[tipo].includes(lancamento.cat)
			? [...CATEGORIAS[tipo], lancamento.cat]
			: CATEGORIAS[tipo];

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<LancamentoValues>({
		resolver: zodResolver(lancamentoSchema),
		defaultValues: valoresIniciais(lancamento),
		mode: "onTouched",
	});

	useEffect(() => {
		if (open) reset(valoresIniciais(lancamento));
	}, [open, lancamento, reset]);

	async function onSubmit(values: LancamentoValues) {
		const dados = {
			desc: values.desc,
			valor: values.valor,
			cat: values.cat,
			data: format(values.data, "yyyy-MM-dd"),
		};
		try {
			if (lancamento) {
				await updateLancamento.mutateAsync({ id: lancamento.id, ...dados });
				toast.success("Alterações salvas");
			} else {
				await createLancamento.mutateAsync({ tipo, ...dados });
				toast.success(textos.criado);
			}
			onOpenChange(false);
		} catch {
			toast.error("Não foi possível salvar. Tente novamente.");
		}
	}

	async function excluir() {
		if (!lancamento) return;
		try {
			await deleteLancamento.mutateAsync(lancamento.id);
			toast.success("Lançamento excluído");
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
						<DrawerTitle>
							{lancamento ? textos.editar : textos.novo}
						</DrawerTitle>
						<DrawerDescription>{textos.descricao}</DrawerDescription>
					</DrawerHeader>

					<div className="flex-1 space-y-4 overflow-y-auto px-4">
						<div className="space-y-2">
							<Label htmlFor={`${tipo}-desc`}>Descrição</Label>
							<InputDescription
								id={`${tipo}-desc`}
								disabled={isSubmitting}
								placeholder={textos.exemplo}
								aria-invalid={!!errors.desc}
								aria-describedby={
									errors.desc ? `${tipo}-desc-error` : undefined
								}
								{...register("desc")}
							/>
							<FieldError
								id={`${tipo}-desc-error`}
								message={errors.desc?.message}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor={`${tipo}-value`}>Valor</Label>
							<Controller
								control={control}
								name="valor"
								render={({ field }) => (
									<InputMoney
										id={`${tipo}-value`}
										disabled={isSubmitting}
										aria-invalid={!!errors.valor}
										aria-describedby={
											errors.valor ? `${tipo}-value-error` : undefined
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
								id={`${tipo}-value-error`}
								message={errors.valor?.message}
							/>
						</div>

						<div className="space-y-2">
							<Label id={`${tipo}-cat-label`}>Categoria</Label>
							<Controller
								control={control}
								name="cat"
								render={({ field }) => (
									<CategoryPicker
										options={categorias}
										disabled={isSubmitting}
										aria-labelledby={`${tipo}-cat-label`}
										aria-invalid={!!errors.cat}
										aria-describedby={
											errors.cat ? `${tipo}-cat-error` : undefined
										}
										ref={field.ref}
										onBlur={field.onBlur}
										value={field.value}
										onValueChange={field.onChange}
									/>
								)}
							/>
							<FieldError
								id={`${tipo}-cat-error`}
								message={errors.cat?.message}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor={`${tipo}-date`}>Data</Label>
							<Controller
								control={control}
								name="data"
								render={({ field }) => (
									<DatePicker
										id={`${tipo}-date`}
										value={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
							<FieldError
								id={`${tipo}-date-error`}
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
						{lancamento && (
							<Button
								type="button"
								variant="ghost"
								disabled={isSubmitting}
								className="col-span-2 text-danger hover:bg-danger-wash hover:text-danger dark:hover:bg-danger-wash"
								onClick={() => setConfirmandoExclusao(true)}
							>
								<Trash2Icon aria-hidden="true" />
								Excluir lançamento
							</Button>
						)}
					</DrawerFooter>
				</form>

				<AlertDialog
					open={confirmandoExclusao}
					onOpenChange={setConfirmandoExclusao}
				>
					<AlertDialogContent>
						<AlertDialogTitle>Excluir “{lancamento?.desc}”?</AlertDialogTitle>
						<AlertDialogDescription>
							Essa ação é definitiva: o lançamento sai do histórico e dos
							totais, e não dá para recuperar.
						</AlertDialogDescription>
						<AlertDialogFooter>
							<AlertDialogCancel>Manter</AlertDialogCancel>
							<Button
								className="bg-danger hover:bg-danger hover:brightness-105"
								disabled={deleteLancamento.isPending}
								onClick={excluir}
							>
								{deleteLancamento.isPending && (
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
