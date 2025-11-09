import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { login, clearError, logout } from '../store/slices/authSlice'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [justLoggedIn, setJustLoggedIn] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, error, user } = useAppSelector(state => state.auth)

  // Auto-redirect after successful login
  useEffect(() => {
    if (isAuthenticated && justLoggedIn) {
      navigate('/')
    }
  }, [isAuthenticated, justLoggedIn, navigate])

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setJustLoggedIn(true)
    await dispatch(login({ username, password }))
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  // Show already logged in message if authenticated
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md text-center">
          <h1 className="mb-4 text-2xl font-bold">Already Logged In</h1>
          <p className="mb-2 text-gray-600">
            You are logged in as <span className="font-semibold">{user?.username}</span>
            {user?.role === 'admin' && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                Admin
              </span>
            )}
          </p>
          <div className="mt-6 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Logout
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Go to Map
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Admin Login</h1>
        
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline"
          >
            Back to Map
          </button>
        </div>
      </div>
    </div>
  )
}
