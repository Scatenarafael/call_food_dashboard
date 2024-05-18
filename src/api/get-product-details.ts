import { api } from '@/lib/axios'

export interface GetProductDetailsParams {
  productId: string
}

export interface GetProductDetailResponse {
  id: string
  name: string
  description: string
  priceInCents: number
  created_at: string
  updated_at: string
  restaurant: string
}

export async function getProductDetails({
  productId,
}: GetProductDetailsParams) {
  const response = await api.get<GetProductDetailResponse>(
    `/products/${productId}`,
  )

  return response.data
}
