import { api } from '@/lib/axios'
import { ProductSaveSchema } from '@/pages/app/products/product-form'

export interface createProductProps {
  data: ProductSaveSchema
}

export async function createProduct({ data }: createProductProps) {
  const response = await api.post(`/products/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}
