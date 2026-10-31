import { getCurrentSession } from "@/lib/auth-server";
import { redirect } from "@tanstack/react-router";

export async function authMiddleware() {
  const session = await getCurrentSession();
  if (!session || !session.user.twoFactorEnabled) {
    throw redirect({ to: "/auth/sign-in" });
  }
  return { user: session.user };
}
