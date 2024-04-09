import { api } from '@/lib/axios'

export async function SignOut() {
  return await api.post('/logout/')
}
