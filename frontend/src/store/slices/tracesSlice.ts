import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import type { Trace } from '../../types/types'

export interface TracesState {
  items: Trace[]
  visible: Trace[]
  isLoading: boolean
  error: string | null
}

const initialState: TracesState = {
  items: [],
  visible: [],
  isLoading: false,
  error: null,
}

export const fetchTraces = createAsyncThunk<Trace[], void, { rejectValue: string }>(
  'traces/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Trace[]>(`${import.meta.env.VITE_API_URL}/traces`)
      return data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch traces')
      }
      return rejectWithValue(err instanceof Error ? err.message : 'An error occurred')
    }
  }
)

const tracesSlice = createSlice({
  name: 'traces',
  initialState,
  reducers: {
    setVisibleTraces(state, action: PayloadAction<Trace[]>) {
      state.visible = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTraces.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTraces.fulfilled, (state, action) => {
        state.isLoading = false
        // Ensure we always have an array
        state.items = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchTraces.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Failed to fetch traces'
      })
  },
})

export const { setVisibleTraces, clearError } = tracesSlice.actions
export default tracesSlice.reducer
