import { api } from '@/lib/axios'
import { ProductSaveSchema } from '@/pages/app/products/product-form'

export interface createProductProps {
  data: ProductSaveSchema
  productId: string
}

export async function updateProduct({ productId, data }: createProductProps) {
  const response = await api.patch(`/products/${productId}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}
