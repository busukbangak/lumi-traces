import './styles/styles.css'
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store, type RootState } from './store/store.ts'
import Sidebar from './components/Sidebar.tsx'
import { useAppDispatch, useAppSelector } from './hooks/hooks.ts'
import { fetchTraces } from './store/slices/tracesSlice.ts'
import Map from './components/Map.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

export default function App() {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector((state: RootState) => state.traces.isLoading)
  const error = useAppSelector((state: RootState) => state.traces.error)

  // Load lumis traces on app start
  useEffect(() => {
    dispatch(fetchTraces())
  }, [dispatch])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading traces...</div>
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500">Error: {error}</div>
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 relative">
        <Map />
      </div>
      <Sidebar />
    </div>
  )
}

