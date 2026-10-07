import { z } from "zod";

export const signInSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "Informe seu e-mail")
		.pipe(z.email("E-mail inválido")),
	password: z
		.string()
		.min(1, "Informe sua senha")
		.min(8, "A senha tem pelo menos 8 caracteres"),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const signUpSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(1, "Informe seu nome")
			.min(2, "Nome muito curto"),
		email: z
			.string()
			.trim()
			.min(1, "Informe seu e-mail")
			.pipe(z.email("E-mail inválido")),
		password: z
			.string()
			.min(1, "Crie uma senha")
			.min(8, "A senha tem pelo menos 8 caracteres"),
		confirmPassword: z.string().min(1, "Confirme sua senha"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const OTP_LENGTH = 6;

const otpCodeSchema = z
	.string()
	.length(OTP_LENGTH, `Digite os ${OTP_LENGTH} dígitos`)
	.regex(/^\d+$/, "Use apenas números");

export const twoFactorSchema = z.object({
	code: otpCodeSchema,
	trustDevice: z.boolean(),
});

export type TwoFactorValues = z.infer<typeof twoFactorSchema>;

/** Confirmação do código ao ativar o 2FA (sign-up, ou retomada de ativação pendente). */
export const twoFactorSetupSchema = z.object({
	code: otpCodeSchema,
});

export type TwoFactorSetupValues = z.infer<typeof twoFactorSetupSchema>;
