import { configureStore } from '@reduxjs/toolkit'
import tracesReducer from './slices/tracesSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    traces: tracesReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
