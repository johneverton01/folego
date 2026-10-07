import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FieldError, FormAlert } from "@/components/auth/FormFeedback";
import { OtpCodeInput } from "@/components/auth/OtpCodeInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import {
	OTP_LENGTH,
	type TwoFactorSetupValues,
	twoFactorSetupSchema,
} from "@/lib/validations/auth";

const ERROR_MESSAGES: Record<string, string> = {
	INVALID_CODE: "Código inválido. Confira e tente de novo.",
};

type TwoFactorSetupFormProps = {
	/** URI `otpauth://` retornada por `twoFactor.enable`, usada para montar o QR code. */
	totpURI: string;
	/** Códigos de recuperação de uso único — mostrados apenas nesta etapa. */
	backupCodes: string[];
	onSuccess: () => void;
};

/**
 * Ativação obrigatória do 2FA: toda conta nova (ou pendente de confirmação)
 * passa por aqui antes de ganhar acesso ao app.
 */
export function TwoFactorSetupForm({
	totpURI,
	backupCodes,
	onSuccess,
}: TwoFactorSetupFormProps) {
	const [codesSaved, setCodesSaved] = useState(false);

	const {
		control,
		handleSubmit,
		setError,
		resetField,
		formState: { errors, isSubmitting },
	} = useForm<TwoFactorSetupValues>({
		resolver: zodResolver(twoFactorSetupSchema),
		defaultValues: { code: "" },
	});

	async function onSubmit({ code }: TwoFactorSetupValues) {
		const { error } = await authClient.twoFactor.verifyTotp({ code });

		if (error) {
			resetField("code");
			setError("root", {
				message:
					(error.code && ERROR_MESSAGES[error.code]) ||
					"Não foi possível confirmar o código.",
			});
			return;
		}

		onSuccess();
	}

	const submit = handleSubmit(onSubmit);

	return (
		<Card className="w-full max-w-100 gap-0 rounded-card border-line bg-surface p-6 shadow-lift">
			<form noValidate onSubmit={submit} className="flex flex-col gap-5">
				<div>
					<h2 className="font-display text-xl font-bold tracking-[-.02em]">
						Ative a verificação em duas etapas
					</h2>
					<p className="mt-1.5 text-sm text-ink-soft">
						Por segurança, toda conta precisa de um app autenticador (Google
						Authenticator, Authy...) para entrar.
					</p>
				</div>

				<FormAlert message={errors.root?.message} />

				{!codesSaved ? (
					<>
						<div className="flex justify-center rounded-control border border-line bg-white p-4">
							<QRCodeSVG value={totpURI} size={176} />
						</div>

						<div className="rounded-control border border-line bg-surface-soft p-4">
							<p className="text-sm font-semibold text-ink">
								Códigos de backup
							</p>
							<p className="mt-1 text-sm text-ink-soft">
								Guarde em um lugar seguro. Eles só aparecem uma vez e servem
								para entrar se você perder o acesso ao autenticador.
							</p>
							<div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-sm text-ink">
								{backupCodes.map((code) => (
									<span key={code}>{code}</span>
								))}
							</div>
						</div>

						<Button
							type="button"
							onClick={() => setCodesSaved(true)}
							className="h-11 rounded-control text-base"
						>
							Já salvei meus códigos
						</Button>
					</>
				) : (
					<>
						<div className="flex flex-col items-center gap-2">
							<Label htmlFor="two-factor-setup-code" className="sr-only">
								Código de verificação
							</Label>
							<Controller
								control={control}
								name="code"
								render={({ field }) => (
									<OtpCodeInput
										id="two-factor-setup-code"
										length={OTP_LENGTH}
										disabled={isSubmitting}
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										onComplete={() => void submit()}
										invalid={!!errors.code || !!errors.root}
										describedBy={
											errors.code ? "two-factor-setup-code-error" : undefined
										}
									/>
								)}
							/>
							<FieldError
								id="two-factor-setup-code-error"
								message={errors.code?.message}
							/>
						</div>

						<p className="text-center text-sm text-ink-soft">
							Digite o código de 6 dígitos mostrado no seu app autenticador.
						</p>

						<Button
							type="submit"
							disabled={isSubmitting}
							className="h-11 rounded-control text-base"
						>
							{isSubmitting && (
								<LoaderCircleIcon className="animate-spin" aria-hidden="true" />
							)}
							Confirmar e entrar
						</Button>
					</>
				)}
			</form>
		</Card>
	);
}
