import { Navigate } from 'react-router-dom'
import { useAuth } from '../services/auth'

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}