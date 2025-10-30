import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import { type Trace } from '../types/types'
import MapMarker from './MapMarker'
import MapEventHandler from './MapEventHandler'

// Tile layer constants
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

interface MapProps {
    traces: Trace[]
    onVisibleTracesUpdate: (visible: Trace[]) => void
}

function Map({ traces, onVisibleTracesUpdate }: MapProps) {
    return (
        <MapContainer center={[20, 0]} zoom={2.5} className="h-full">
            {/* Handle map events */}
            <MapEventHandler traces={traces} onVisibleTracesUpdate={onVisibleTracesUpdate} />

            {/* Display tile layers */}
            <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} />

            {/* Display lumi map marker traces */}
            {traces.map(trace => (<MapMarker key={trace._id} trace={trace} />))}
        </MapContainer>
    )
}

export default Map