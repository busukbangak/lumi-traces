import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface UIState {
  mapInteractionsEnabled: boolean
  selectedTraceId: string | null
}

const initialState: UIState = {
  mapInteractionsEnabled: true,
  selectedTraceId: null,
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
    selectTrace(state, action: PayloadAction<string>) {
      state.selectedTraceId = action.payload
    },
    clearSelectedTrace(state) {
      state.selectedTraceId = null
    },
  },
})

export const { disableMapInteractions, enableMapInteractions, selectTrace, clearSelectedTrace } = uiSlice.actions
export default uiSlice.reducer
