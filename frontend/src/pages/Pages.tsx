import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAppDispatch } from '../hooks/hooks'
import { userReturn } from '../store/slices/authSlice'
import MapPage from './MapPage'
import AdminPage from './AdminPage'

export default function Pages() {
  const dispatch = useAppDispatch()

  // Restore user session on app load
  useEffect(() => {
    dispatch(userReturn())
  }, [dispatch])

  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}
