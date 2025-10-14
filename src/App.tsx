import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

enum TraceStatus {
  ACTIVE,
  MISSING,
  PENDING,
  REMOVED,
  INVALID
}

interface MarkerData {
  id: number
  status: TraceStatus
  position: [number, number]
  title: string
  description: string
  image: string
}

const MARKERS: MarkerData[] = [
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
]

function App() {

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer center={[51.505, -0.09]} zoom={13}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {MARKERS.map(marker => (
            <Marker key={marker.id} position={marker.position}>
              <Popup>
                <div>
                  <h3>{marker.title}</h3>
                  <p>{marker.description}</p>
                  <img src={marker.image} alt={marker.title} style={{ width: '100%' }} />
                  <p>Status: {marker.status == TraceStatus.ACTIVE ? "Active" : "Inactive"}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>

  )
}

export default App
