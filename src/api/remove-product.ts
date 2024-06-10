import { api } from '@/lib/axios'

interface RemoveProductProps {
  id: string
}

export async function RemoveProduct({ id }: RemoveProductProps) {
  await api.delete(`/products/${id}`)
}
