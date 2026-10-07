import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { prisma } from "@/lib/prisma";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
	appName: "Fôlego",
	database: prismaAdapter(prisma, { provider: "postgresql" }),
	emailAndPassword: {
		enabled: true,
	},
	// Google só é registrado quando as credenciais existem, para não quebrar o dev local.
	socialProviders:
		googleClientId && googleClientSecret
			? {
					google: {
						clientId: googleClientId,
						clientSecret: googleClientSecret,
						prompt: "select_account",
					},
				}
			: {},
	plugins: [
		twoFactor({
			issuer: "Fôlego",
			otpOptions: {
				// TODO: trocar pelo provedor de e-mail (Resend, SES...) antes de ir pra produção.
				async sendOTP({ user, otp }) {
					console.info(`[2FA] Código para ${user.email}: ${otp}`);
				},
			},
		}),
		// Precisa ser o último plugin para aplicar os cookies nas respostas.
		tanstackStartCookies(),
	],
});
