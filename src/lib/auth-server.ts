import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

/** Sessão do usuário autenticado, lida a partir dos cookies da requisição. */
export const getCurrentSession = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  return auth.api.getSession({ headers: request.headers })
})
