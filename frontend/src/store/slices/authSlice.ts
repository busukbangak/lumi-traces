import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export interface AuthState {
  isAuthenticated: boolean
  user: { username: string; role: string } | null
  token: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
}

export const login = createAsyncThunk<
  { token: string; user: { username: string; role: string } },
  { username: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials)
      localStorage.setItem('token', data.token)
      return data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.error || 'Login failed')
      }
      return rejectWithValue('An error occurred during login')
    }
  }
)

export const userReturn = createAsyncThunk<
  { user: { username: string; role: string } },
  void,
  { rejectValue: string }
>(
  'auth/return',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState }
      const token = state.auth.token
      
      if (!token) {
        return rejectWithValue('No token found')
      }

      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/return`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return data
    } catch {
      localStorage.removeItem('token')
      return rejectWithValue('Failed to return user. Token invalid')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('token')
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(login.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Login failed'
      })
      // Return user session
      .addCase(userReturn.pending, state => {
        state.isLoading = true
      })
      .addCase(userReturn.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
      })
      .addCase(userReturn.rejected, state => {
        state.isLoading = false
        state.isAuthenticated = false
        state.token = null
        state.user = null
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
