import { createSlice } from '@reduxjs/toolkit'

export interface UIState {
  mapInteractionsEnabled: boolean
}

const initialState: UIState = {
  mapInteractionsEnabled: true,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    disableMapInteractions(state) {
      state.mapInteractionsEnabled = false
    },
    enableMapInteractions(state) {
      state.mapInteractionsEnabled = true
    },
  },
})

export const { disableMapInteractions, enableMapInteractions } = uiSlice.actions
export default uiSlice.reducer
