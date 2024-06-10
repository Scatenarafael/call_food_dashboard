import { Outlet } from 'react-router-dom'

import { Header } from '@/components/header'
import { ProfileProvider } from '@/contexts/profile-context'

export function AppLayout() {
  // useEffect(() => {
  //   const interceptorId = api.interceptors.response.use(
  //     (response) => response,
  //     (error) => {
  //       if (isAxiosError(error)) {
  //         const status = error.response?.status

  //         console.log('error >>> ', error)
  //         if (status === 401) {
  //           navigate('/sign-in', { replace: true })
  //         } else {
  //           throw error
  //         }
  //       }
  //     },
  //   )

  //   return () => {
  //     api.interceptors.response.eject(interceptorId)
  //   }
  // }, [])

  return (
    <ProfileProvider>
      <div className="flex min-h-screen flex-col antialiased">
        <Header />

        <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
          <Outlet />
        </div>
      </div>
    </ProfileProvider>
  )
}
