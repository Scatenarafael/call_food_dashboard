import { api } from '@/lib/axios'

export type RestaurantProfileProps = {
  id: string
  name: string
  description: string
}

export interface GetProfileResponse {
  id: string
  username: string
  email: string
  phone: string | null
  restaurants: RestaurantProfileProps[]
  role: number
  createdAt: string
  updatedAt: string
}

export async function getProfile() {
  const response = await api.get<GetProfileResponse>('/user-profile/')

  return response.data
}
