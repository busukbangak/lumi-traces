import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import MapMarker from './MapMarker'
import MapEventHandler from './MapEventHandler'
import type { RootState } from '../store/store'
import type { Trace } from '../types/types'
import { useAppSelector } from '../hooks/hooks'

// Tile layer constants
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

function Map() {
    const traces = useAppSelector((state: RootState) => state.traces.items)
    return (
        <MapContainer center={[20, 0]} zoom={2.5} className="h-full">
            {/* Handle map events */}
            <MapEventHandler />

            {/* Display tile layers */}
            <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} />

            {/* Display lumi map marker traces */}
            {traces.map((trace: Trace) => (<MapMarker key={trace._id} trace={trace} />))}
        </MapContainer>
    )
}

export default Map