import { RestaurantSaveSchema } from '@/components/store-profile-dialog'
import { api } from '@/lib/axios'

export interface createRestaurantProps {
  data: RestaurantSaveSchema
}

export async function createRestaurant({ data }: createRestaurantProps) {
  const response = await api.post(`/restaurants/`, data)

  return response.data
}
