import { api } from '@/lib/axios'

export interface SignInBody {
  email: string
  password: string
}

export async function signIn({ email, password }: SignInBody) {
  return await api.post('/token/', { email, password })
}
