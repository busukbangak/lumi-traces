import { configureStore } from '@reduxjs/toolkit'
import tracesReducer from './slices/tracesSlice'

export const store = configureStore({
  reducer: {
    traces: tracesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
