import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import Map from './components/Map'
import { TraceStatus, type TraceData } from './types/types'
import Sidebar from './components/Sidebar';

const MARKERS: TraceData[] = [
  {
    id: 1,
    status: TraceStatus.ACTIVE,
    position: [51.505, -0.09],
    title: "London Central",
    description: "Heart of London with amazing attractions",
    image: "https://picsum.photos/300/200?random=1",
  },
  {
    id: 2,
    status: TraceStatus.PENDING,
    position: [51.515, -0.1],
    title: "North London",
    description: "Vibrant area with parks and museums",
    image: "https://picsum.photos/300/200?random=2",
  },
  {
    id: 3,
    status: TraceStatus.MISSING,
    position: [51.495, -0.08],
    title: "South London",
    description: "Historic area with great restaurants",
    image: "https://picsum.photos/300/200?random=3",
  }
];

function App() {
  const [markers] = useState<TraceData[]>(MARKERS) // TODO: fetch from API
  const [visibleMarkers, setVisibleMarkers] = useState<TraceData[]>([]) // Todo: update via state management

  return (
    <div className="flex h-screen">
      <div className="flex-1 relative">
        <Map markers={markers} onVisibleMarkersUpdate={setVisibleMarkers} />
      </div>
      <Sidebar visibleMarkers={visibleMarkers} />
    </div>
  )
}

export default App