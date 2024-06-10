import { api } from '@/lib/axios'

export async function logout() {
  try {
    await api.post('/logout/')
  } catch (e) {
    console.log(e)
  }
}
