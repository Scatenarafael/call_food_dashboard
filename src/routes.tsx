import { createBrowserRouter } from 'react-router-dom'

import { Dashboard } from './pages/app/dashboad'

export const router = createBrowserRouter([
  { path: '/', element: <Dashboard /> },
])
