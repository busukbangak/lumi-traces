import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

const MARKERS = [
  {
    id: 1,
    position: [51.505, -0.09] as [number, number],
    popup: "London - First marker"
  },
  {
    id: 2,
    position: [51.515, -0.1] as [number, number],
    popup: "Near London - Second marker"
  },
  {
    id: 3,
    position: [51.495, -0.08] as [number, number],
    popup: "South London - Third marker"
  }
]

function App() {

  return (

    <MapContainer center={[51.505, -0.09]} zoom={13}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {MARKERS.map(marker => (
        <Marker key={marker.id} position={marker.position}>
          <Popup>
            {marker.popup}
          </Popup>
        </Marker>
      ))}
    </MapContainer >

  )
}

export default App
