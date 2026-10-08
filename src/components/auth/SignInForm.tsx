import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/auth/FormFeedback";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { TwoFactorForm } from "@/components/auth/TwoFactorForm";
import { TwoFactorSetupForm } from "@/components/auth/TwoFactorSetupForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputEmail } from "@/components/ui/input-email";
import { InputPassword } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { type SignInValues, signInSchema } from "@/lib/validations/auth";
import { toast } from "sonner";

const REDIRECT_TO = "/app";

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "E-mail ou senha incorretos.",
  EMAIL_NOT_VERIFIED: "Confirme seu e-mail antes de entrar.",
  USER_BANNED: "Esta conta está suspensa.",
};

type Step =
  | { name: "credentials" }
  | { name: "two-factor"; methods: string[] }
  | { name: "two-factor-setup"; totpURI: string; backupCodes: string[] };

export function SignInForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>({ name: "credentials" });

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: SignInValues) {
    const { data, error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error((error.code && ERROR_MESSAGES[error.code]) ||
          "Não foi possível entrar. Tente novamente.")
      return;
    }

    // Usuário com 2FA ativo: a sessão só é criada depois de validar o código.
    if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
      const methods =
        "twoFactorMethods" in data && Array.isArray(data.twoFactorMethods)
          ? (data.twoFactorMethods as string[])
          : ["totp"];
      setStep({ name: "two-factor", methods });
      return;
    }

    // Conta que nunca concluiu a ativação obrigatória do 2FA (ex.: fechou a
    // aba durante o cadastro): retoma a ativação antes de liberar o /app.
    if (data && "user" in data && !data.user.twoFactorEnabled) {
      const { data: enableData, error: enableError } =
        await authClient.twoFactor.enable({
          password: values.password,
          method: "totp",
        });

      if (enableError || enableData?.method !== "totp") {
        toast.error( "Não foi possível preparar a verificação em duas etapas. Tente novamente.")
        return;
      }

      setStep({
        name: "two-factor-setup",
        totpURI: enableData.totpURI,
        backupCodes: enableData.backupCodes,
      });
      return;
    }

    await navigate({ to: REDIRECT_TO });
  }

  if (step.name === "two-factor") {
    return (
      <TwoFactorForm
        methods={step.methods}
        onSuccess={() => navigate({ to: REDIRECT_TO })}
        onBack={() => {
          form.resetField("password");
          setStep({ name: "credentials" });
        }}
      />
    );
  }

  if (step.name === "two-factor-setup") {
    return (
      <TwoFactorSetupForm
        totpURI={step.totpURI}
        backupCodes={step.backupCodes}
        onSuccess={() => navigate({ to: REDIRECT_TO })}
      />
    );
  }

  return (
    <Card className="w-full max-w-100 gap-0 rounded-card border-line bg-surface p-6 shadow-lift">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => errors.root && clearErrors("root")}
        className="flex flex-col gap-4"
      >
        
        <div className="flex flex-col gap-2">
          <Label htmlFor="sign-in-email">E-mail</Label>
          <InputEmail
            id="sign-in-email"
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "sign-in-email-error" : undefined}
            {...register("email")}
          />
          <FieldError
            id="sign-in-email-error"
            message={errors.email?.message}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="sign-in-password">Senha</Label>
          </div>
          <InputPassword
            id="sign-in-password"
            disabled={isSubmitting}
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? "sign-in-password-error" : undefined
            }
            {...register("password")}
          />
          <FieldError
            id="sign-in-password-error"
            message={errors.password?.message}
          />
        </div>
        <div className="flex items-end justify-end">
          <Link
            to="/auth/recover"
            className="text-sm text-accent-deep hover:underline justify-end"
          >
            Esqueci minha senha
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 h-11 rounded-control text-base"
        >
          {isSubmitting && (
            <LoaderCircleIcon className="animate-spin" aria-hidden="true" />
          )}
          Entrar
        </Button>
      </form>
      <div className="flex items-center gap-3 text-[.82rem] text-ink-faint py-2">
        <span className="h-px flex-1 bg-line" />
        ou com e-mail
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="flex flex-col gap-4">
        <GoogleSignInButton
          callbackURL={REDIRECT_TO}
          disabled={isSubmitting}
          onError={(message) => toast.error(message )}
        />

        <p className="text-center text-sm text-ink-soft">
          Ainda não tem conta?{" "}
          <Link
            to="/auth/sign-up"
            className="font-medium text-accent-deep hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </Card>
  );
}
