import { useAuth } from '../services/auth'

function LoginButton() {
  const { login, logout, isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user.name}</p>
        <button onClick={() => logout()}>Logout</button>
      </div>
    )
  }

  return <button onClick={() => login()}>Login</button>
}

export default LoginButton