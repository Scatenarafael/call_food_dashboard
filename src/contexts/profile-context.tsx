
import { GetProfileResponse, getProfile } from "@/api/get-profile";
import { logout } from "@/api/logout";
import { env } from "@/env";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ProfileContextData = {
  profile?: GetProfileResponse
  isLoadingProfile: boolean
  activeRestaurant: ActiveRestaurantType | null
  setActiveRestaurant: React.Dispatch<React.SetStateAction<ActiveRestaurantType | null>>
};

export const ProfileContext = createContext({} as ProfileContextData);

type AuthProviderProps = {
  children: ReactNode;
};

type ActiveRestaurantType = {
  id: string
  name: string
}


export function ProfileProvider({ children }: AuthProviderProps) {
  const [activeRestaurant, setActiveRestaurant] = useState<ActiveRestaurantType | null>(null)
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const navigate = useNavigate()

  useEffect(() => {
    if (!activeRestaurant) {
      const localStorageRestaurant = localStorage.getItem("activeRestaurant")
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
              if (response.status >= 400) {
                window.location.replace(`${env.VITE_DASHBOARD_URL}/sign-in`)
                }
            })
            .catch(() => {
              window.location.replace(`${env.VITE_DASHBOARD_URL}/sign-in`)
            })
        }
      } else {
        if (!refreshing) {
          refreshing = true
          logout().then(() => {
            window.location.replace(`${env.VITE_DASHBOARD_URL}/sign-in`)
          })
        }
      }
    },
  )


  return (
    <ProfileContext.Provider value={{ profile, isLoadingProfile, activeRestaurant, setActiveRestaurant }}>
      {children}
    </ProfileContext.Provider>
  );
}

