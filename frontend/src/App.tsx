import './styles/styles.css'
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { store, type RootState } from './store/store.ts'
import Sidebar from './components/Sidebar.tsx'
import { useAppDispatch, useAppSelector } from './hooks/hooks.ts'
import { fetchTraces } from './store/slices/tracesSlice.ts'
import { verifyToken } from './store/slices/authSlice.ts'
import Map from './components/Map.tsx'
import AdminLogin from './components/AdminLogin.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

function MapView() {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector((state: RootState) => state.traces.isLoading)
  const error = useAppSelector((state: RootState) => state.traces.error)

  // Load traces and verify token on mount
  useEffect(() => {
    dispatch(fetchTraces())
    dispatch(verifyToken())
  }, [dispatch])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading traces...</div>
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500">Error: {error}</div>
  }

  return (
    <>
      <div className="flex h-screen">
        <div className="flex-1 relative">
          <Map />
        </div>
        <Sidebar />
      </div>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MapView />} />
      <Route path="/admin" element={<AdminLogin />} />
    </Routes>
  )
}

