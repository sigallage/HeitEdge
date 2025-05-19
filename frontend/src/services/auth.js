import { useAuth0 } from '@auth0/auth0-react'

export const useAuth = () => {
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently
  } = useAuth0()

  const getToken = async () => {
    try {
      return await getAccessTokenSilently()
    } catch (error) {
      console.error('Error getting token:', error)
      return null
    }
  }

  return {
    login: loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    isLoading,
    getToken
  }
}