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

export const verifyToken = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string }
>(
  'auth/verify',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState }
      const token = state.auth.token
      
      if (!token) {
        return rejectWithValue('No token found')
      }

      await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return true
    } catch {
      localStorage.removeItem('token')
      return rejectWithValue('Token verification failed')
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
      // Verify token
      .addCase(verifyToken.pending, state => {
        state.isLoading = true
      })
      .addCase(verifyToken.fulfilled, state => {
        state.isLoading = false
        state.isAuthenticated = true
      })
      .addCase(verifyToken.rejected, state => {
        state.isLoading = false
        state.isAuthenticated = false
        state.token = null
        state.user = null
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
