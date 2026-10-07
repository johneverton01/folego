import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FieldError, FormAlert } from "@/components/auth/FormFeedback";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { TwoFactorSetupForm } from "@/components/auth/TwoFactorSetupForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputEmail } from "@/components/ui/input-email";
import { InputName } from "@/components/ui/input-name";
import { InputPassword } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { type SignUpValues, signUpSchema } from "@/lib/validations/auth";

const REDIRECT_TO = "/app";

const ERROR_MESSAGES: Record<string, string> = {
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Esse e-mail já está em uso.",
  PASSWORD_TOO_SHORT: "A senha é muito curta.",
  PASSWORD_TOO_LONG: "A senha é muito longa.",
  INVALID_EMAIL: "E-mail inválido.",
};

type Step =
  | { name: "credentials" }
  | { name: "two-factor-setup"; totpURI: string; backupCodes: string[] };

export function SignUpForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>({ name: "credentials" });

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  async function onSubmit(values: SignUpValues) {
    const { error: signUpError } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (signUpError) {
      setError("root", {
        message:
          (signUpError.code && ERROR_MESSAGES[signUpError.code]) ||
          "Não foi possível criar sua conta. Tente novamente.",
      });
      return;
    }

    // Toda conta nova precisa ativar o 2FA antes de acessar o app (ver /app beforeLoad).
    const { data, error: enableError } = await authClient.twoFactor.enable({
      password: values.password,
      method: "totp",
    });

    if (enableError || data?.method !== "totp") {
      setError("root", {
        message:
          "Conta criada, mas não foi possível preparar a verificação em duas etapas. Tente entrar novamente em instantes.",
      });
      return;
    }

    setStep({
      name: "two-factor-setup",
      totpURI: data.totpURI,
      backupCodes: data.backupCodes,
    });
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
        <FormAlert message={errors.root?.message} />

        <div className="flex flex-col gap-2">
          <Label htmlFor="sign-up-name">Nome</Label>
          <InputName
            id="sign-up-name"
            disabled={isSubmitting}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "sign-up-name-error" : undefined}
            {...register("name")}
          />
          <FieldError id="sign-up-name-error" message={errors.name?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="sign-up-email">E-mail</Label>
          <InputEmail
            id="sign-up-email"
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "sign-up-email-error" : undefined}
            {...register("email")}
          />
          <FieldError
            id="sign-up-email-error"
            message={errors.email?.message}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="sign-up-password">Senha</Label>
          <InputPassword
            id="sign-up-password"
            disabled={isSubmitting}
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? "sign-up-password-error" : undefined
            }
            {...register("password")}
          />
          <FieldError
            id="sign-up-password-error"
            message={errors.password?.message}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="sign-up-confirm-password">Confirmar senha</Label>
          <InputPassword
            id="sign-up-confirm-password"
            disabled={isSubmitting}
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword
                ? "sign-up-confirm-password-error"
                : undefined
            }
            {...register("confirmPassword")}
          />
          <FieldError
            id="sign-up-confirm-password-error"
            message={errors.confirmPassword?.message}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 h-11 rounded-control text-base"
        >
          {isSubmitting && (
            <LoaderCircleIcon className="animate-spin" aria-hidden="true" />
          )}
          Criar conta
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
          onError={(message) => setError("root", { message })}
        />

        <p className="text-center text-sm text-ink-soft">
          Já tem uma conta?{" "}
          <Link
            to="/auth/sign-in"
            className="font-medium text-accent-deep hover:underline"
          >
            Entrar
          </Link>
        </p>
      </div>
    </Card>
  );
}
