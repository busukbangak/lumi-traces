import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector, useIsMobile } from '../hooks/hooks'
import { fetchTraces } from '../store/slices/tracesSlice'
import Map from '../components/Map'
import Sidebar from '../components/Sidebar'
import AddTraceButton from '../components/AddTraceButton'
import WelcomeOverlay from '../components/WelcomeOverlay'
import type { RootState } from '../store/store'

export default function MapPage() {
    const dispatch = useAppDispatch()
    const isLoading = useAppSelector((state: RootState) => state.traces.isLoading)
    const error = useAppSelector((state: RootState) => state.traces.error)
    const isMobile = useIsMobile()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Load traces on mount
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
                
                {/* Hide buttons when sidebar is open on mobile */}
                {isMobile && isSidebarOpen ? null : (
                    <>
                        <AddTraceButton />
                        <WelcomeOverlay />
                    </>
                )}
                
                {/* Mobile sidebar toggle button */}
                {isMobile && (
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="fixed top-4 right-4 z-[1001] bg-white rounded-lg shadow-lg p-3 border border-gray-200 hover:bg-gray-50 transition-colors"
                        title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                    >
                        {isSidebarOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            
            {/* Sidebar - toggleable on mobile, always visible on desktop */}
            <div className={`
                fixed lg:relative inset-0 lg:inset-y-0 lg:right-0 z-[1000]
                transform transition-transform duration-300 ease-in-out
                ${isMobile && !isSidebarOpen ? 'translate-x-full' : 'translate-x-0'}
            `}>
                <Sidebar onClose={isMobile ? () => setIsSidebarOpen(false) : undefined} />
            </div>
        </div>
    )
}
