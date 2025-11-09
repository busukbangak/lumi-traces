import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { fetchTraces } from '../store/slices/tracesSlice'
import { userReturn } from '../store/slices/authSlice'
import Map from '../components/Map'
import Sidebar from '../components/Sidebar'
import LogoutButton from '../components/LogoutButton'
import type { RootState } from '../store/store'

export default function MapPage() {
    const dispatch = useAppDispatch()
    const isLoading = useAppSelector((state: RootState) => state.traces.isLoading)
    const error = useAppSelector((state: RootState) => state.traces.error)

    // Load traces and restore user session on mount
    useEffect(() => {
        dispatch(fetchTraces())
        dispatch(userReturn())
    }, [dispatch])

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading traces...</div>
    }

    if (error) {
        return <div className="flex h-screen items-center justify-center text-red-500">Error: {error}</div>
    }

    return (
        <div className="flex h-screen">
            <LogoutButton />
            <div className="flex-1 relative">
                <Map />
            </div>
            <Sidebar />
        </div>
    )
}
