import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import type { TraceData } from '../types/types'
import { MapEventHandler } from './MapEventHandler'
import { statusText } from '../utils/utils'

interface MapProps {
    markers: TraceData[]
    onVisibleMarkersUpdate: (visible: TraceData[]) => void
}

function Map({ markers, onVisibleMarkersUpdate }: MapProps) {
    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} className="h-full">
            <MapEventHandler markers={markers} onVisibleMarkersUpdate={onVisibleMarkersUpdate} />

            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {markers.map(marker => (
                <Marker key={marker.id} position={marker.position}>
                    <Popup>
                        <div>
                            <h3>{marker.title}</h3>
                            <p>{marker.description}</p>
                            <img src={marker.image} alt={marker.title} />
                            <p>Status: {statusText(marker.status)}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}

export default Map