import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import Map from './components/Map'
import Sidebar from './components/Sidebar';
import type { Trace } from './types/types';


function App() {
  const [traces, setTraces] = useState<Trace[]>([])
  const [visibleTraces, setVisibleTraces] = useState<Trace[]>([]) // Todo: update via state management
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTraces = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/traces`)

        if (!response.ok) {
          throw new Error('Failed to fetch traces')
        }

        const data = await response.json()

        setTraces(data)
        setIsError(null)
      } catch (err) {
        setIsError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching traces:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTraces()
  }, [])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading traces...</div>
  }

  if (isError) {
    return <div className="flex h-screen items-center justify-center text-red-500">Error: {isError}</div>
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 relative">
        <Map traces={traces} onVisibleTracesUpdate={setVisibleTraces} />
      </div>
      <Sidebar visibleTraces={visibleTraces} />
    </div>
  )
}

export default App