import { api } from '@/lib/axios'
import { ORDER_STATUS } from '@/pages/app/orders/order-table-row'

export interface GetOrdersQuery {
  pageIndex?: number | null
  orderId?: string | null
  customerName?: string | null
  status?: number | 'all' | null
}

export interface GetOrdersResponse {
  results: {
    orderId: string
    createdAt: string
    status: number
    customerName: string
    total: number
  }[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getOrders({
  pageIndex,
  orderId,
  customerName,
  status,
}: GetOrdersQuery) {
  const page = (pageIndex || 0) + 1
  const response = await api.get<GetOrdersResponse>('/orders', {
    params: {
      page,
      orderId,
      customerName,
      status: status === 'all' || !status ? null : ORDER_STATUS[status],
    },
  })
  return response.data
}
