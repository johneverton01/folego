import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, LoaderCircleIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FieldError } from "@/components/auth/FormFeedback";
import { OtpCodeInput } from "@/components/auth/OtpCodeInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import {
	OTP_LENGTH,
	type TwoFactorValues,
	twoFactorSchema,
} from "@/lib/validations/auth";

import { toast } from "sonner";


type Method = "totp" | "otp";

const ERROR_MESSAGES: Record<string, string> = {
	INVALID_CODE: "Código inválido. Confira e tente de novo.",
	OTP_HAS_EXPIRED: "O código expirou. Peça um novo.",
	TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE: "Muitas tentativas. Peça um novo código.",
	ACCOUNT_TEMPORARILY_LOCKED:
		"Conta bloqueada temporariamente. Tente mais tarde.",
	INVALID_TWO_FACTOR_COOKIE: "Sua sessão expirou. Volte e entre novamente.",
};

const COPY: Record<Method, { title: string; description: string }> = {
	totp: {
		title: "Verificação em duas etapas",
		description: "Digite o código de 6 dígitos do seu app autenticador.",
	},
	otp: {
		title: "Confira seu e-mail",
		description: "Enviamos um código de 6 dígitos para o seu e-mail.",
	},
};

type TwoFactorFormProps = {
	/** Métodos habilitados para o usuário, vindos de `twoFactorMethods` no sign-in. */
	methods: string[];
	onSuccess: () => void;
	onBack: () => void;
};

export function TwoFactorForm({
	methods,
	onSuccess,
	onBack,
}: TwoFactorFormProps) {
	const canUseTotp = methods.includes("totp");
	const canUseOtp = methods.includes("otp");
	const [method, setMethod] = useState<Method>(canUseTotp ? "totp" : "otp");
	// Ref (e não state) para não disparar o envio duas vezes no StrictMode.
	const autoSent = useRef(false);
	const [sending, setSending] = useState(false);

	const {
		control,
		register,
		handleSubmit,
		setError,
		resetField,
		formState: { errors, isSubmitting },
	} = useForm<TwoFactorValues>({
		resolver: zodResolver(twoFactorSchema),
		defaultValues: { code: "", trustDevice: false },
	});

	const sendOtp = useCallback(async () => {
		setSending(true);
		const { error } = await authClient.twoFactor.sendOtp();
		setSending(false);
		if (error) {
			toast.error((error.code && ERROR_MESSAGES[error.code]) ||
					"Não foi possível enviar o código.",)
			setError("root", {
				message:
					(error.code && ERROR_MESSAGES[error.code]) ||
					"Não foi possível enviar o código.",
			});
		}
	}, [setError]);

	// Ao cair no método por e-mail, dispara o envio automaticamente uma vez.
	useEffect(() => {
		if (method !== "otp" || autoSent.current) return;
		autoSent.current = true;
		void sendOtp();
	}, [method, sendOtp]);

	async function onSubmit({ code, trustDevice }: TwoFactorValues) {
		const verify =
			method === "totp"
				? authClient.twoFactor.verifyTotp
				: authClient.twoFactor.verifyOtp;
		const { error } = await verify({ code, trustDevice });

		if (error) {
			resetField("code");
			toast.error(error.code && ERROR_MESSAGES[error.code]) ||
					"Não foi possível enviar o código.",
			setError("root", {
				message:
					(error.code && ERROR_MESSAGES[error.code]) ||
					"Não foi possível validar o código.",
			});
			return;
		}

		onSuccess();
	}

	function switchMethod(next: Method) {
		resetField("code");
		setMethod(next);
	}

	const submit = handleSubmit(onSubmit);
	const { title, description } = COPY[method];

	return (
		<Card className="w-full max-w-100 gap-0 rounded-card border-line bg-surface p-6 shadow-lift">
			<form noValidate onSubmit={submit} className="flex flex-col gap-5">
				<div>
					<h2 className="font-display text-xl font-bold tracking-[-.02em]">
						{title}
					</h2>
					<p className="mt-1.5 text-sm text-ink-soft">{description}</p>
				</div>

				<div className="flex flex-col items-center gap-2">
					<Label htmlFor="two-factor-code" className="sr-only">
						Código de verificação
					</Label>
					<Controller
						control={control}
						name="code"
						render={({ field }) => (
							<OtpCodeInput
								id="two-factor-code"
								length={OTP_LENGTH}
								disabled={isSubmitting}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								// Envia sozinho quando os 6 dígitos são preenchidos.
								onComplete={() => void submit()}
								invalid={!!errors.code || !!errors.root}
								describedBy={errors.code ? "two-factor-code-error" : undefined}
							/>
						)}
					/>
					<FieldError
						id="two-factor-code-error"
						message={errors.code?.message}
					/>
				</div>

				<label className="flex items-center gap-2.5 text-sm text-ink-soft">
					<input
						type="checkbox"
						className="size-4 rounded accent-accent"
						disabled={isSubmitting}
						{...register("trustDevice")}
					/>
					Confiar neste dispositivo por 30 dias
				</label>

				<Button
					type="submit"
					disabled={isSubmitting}
					className="h-11 rounded-control text-base"
				>
					{isSubmitting && (
						<LoaderCircleIcon className="animate-spin" aria-hidden="true" />
					)}
					Verificar
				</Button>

				<div className="flex flex-col items-center gap-1 text-sm">
					{method === "otp" && (
						<Button
							type="button"
							variant="link"
							disabled={sending}
							onClick={() => void sendOtp()}
							className="text-accent-deep"
						>
							{sending ? "Enviando..." : "Reenviar código"}
						</Button>
					)}
					{method === "totp" && canUseOtp && (
						<Button
							type="button"
							variant="link"
							onClick={() => switchMethod("otp")}
							className="text-accent-deep"
						>
							Receber código por e-mail
						</Button>
					)}
					{method === "otp" && canUseTotp && (
						<Button
							type="button"
							variant="link"
							onClick={() => switchMethod("totp")}
							className="text-accent-deep"
						>
							Usar app autenticador
						</Button>
					)}
					<Button
						type="button"
						variant="ghost"
						onClick={onBack}
						className="text-ink-soft hover:bg-surface-soft hover:text-ink dark:hover:bg-surface-soft"
					>
						<ArrowLeftIcon aria-hidden="true" />
						Voltar
					</Button>
				</div>
			</form>
		</Card>
	);
}
