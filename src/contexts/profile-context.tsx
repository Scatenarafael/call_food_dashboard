import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { createContext, ReactNode, useEffect, useState } from 'react'

import { getProfile, GetProfileResponse } from '@/api/get-profile'
import { logout } from '@/api/logout'
import { env } from '@/env'
import { api } from '@/lib/axios'

type AuthProviderProps = {
  children: ReactNode
}

type ActiveRestaurantType = {
  id: string
  name: string
}

type ProfileContextData = {
  profile?: GetProfileResponse
  isLoadingProfile: boolean
  activeRestaurant: ActiveRestaurantType | null
  setActiveRestaurant: React.Dispatch<
    React.SetStateAction<ActiveRestaurantType | null>
  >
}

export const ProfileContext = createContext({} as ProfileContextData)

export function ProfileProvider({ children }: AuthProviderProps) {
  const [activeRestaurant, setActiveRestaurant] =
    useState<ActiveRestaurantType | null>(null)
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', activeRestaurant?.id],
    queryFn: getProfile,
  })

  useEffect(() => {
    if (!activeRestaurant) {
      const localStorageRestaurant = localStorage.getItem('activeRestaurant')
      if (localStorageRestaurant) {
        setActiveRestaurant(JSON.parse(localStorageRestaurant))
      }
    }
  }, [])

  let refreshing = false

  api.interceptors.response.use(
    (response) => {
      return response
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (error: AxiosError<any>) => {
      console.log('window.location.pathname >>> ', window.location.pathname)
      console.log('error >>> ', error.response?.status)
      if (
        error.response?.status === 401 &&
        error.response.data.detail ===
          'Authentication credentials were not provided.'
      ) {
        if (!refreshing) {
          refreshing = true
          api
            .post('/jwt/refresh/')
            .then((response) => {
              if (response.status === 401) {
                window.location.replace(`${env.VITE_DASHBOARD_URL}/sign-in`)
              }
            })
            .catch((e) => {
              if (e.status === 401) {
                window.location.replace(`${env.VITE_DASHBOARD_URL}/sign-in`)
              }
            })
        }
      } else {
        if (!refreshing) {
          refreshing = true
          if (e.status === 401) {
            logout().then(() => {
              window.location.replace(`${env.VITE_DASHBOARD_URL}/sign-in`)
            })
          }
        }
      }
    },
  )

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoadingProfile,
        activeRestaurant,
        setActiveRestaurant,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}
