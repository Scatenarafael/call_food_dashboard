import { api } from '@/lib/axios'

export interface GetProductsQuery {
  pageIndex?: number | null
  id?: string | null
  name?: string | null
  description?: string | null
}

export type ProductProps = {
  id: string
  name: string
  description: string
  priceInCents: number
  created_at: string
  updated_at: string
  restaurant: string
}

export type ProductsResponseProps = {
  meta: {
    totalCount: number
    perPage: number
    pageIndex: number
  }
  results: ProductProps[]
}

export async function getProducts({
  id,
  name,
  description,
  pageIndex,
}: GetProductsQuery) {
  const page = (pageIndex || 0) + 1
  const response = await api.get<ProductsResponseProps>('/products', {
    params: {
      id,
      name,
      description,
      page,
    },
  })
  return response.data
}
