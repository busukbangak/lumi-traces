import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import type { Trace } from '../types/types'
import { MapEventHandler } from './MapEventHandler'
import { getStatusText } from '../utils/utils'

interface MapProps {
    traces: Trace[]
    onVisibleTracesUpdate: (visible: Trace[]) => void
}

function Map({ traces, onVisibleTracesUpdate }: MapProps) {
    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} className="h-full">
            <MapEventHandler traces={traces} onVisibleTracesUpdate={onVisibleTracesUpdate} />

            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {traces.map(marker => (
                <Marker key={marker._id} position={marker.position}>
                    <Popup>
                        <div>
                            <h3>{marker.title}</h3>
                            <p>{marker.description}</p>
                            <img src={`${import.meta.env.VITE_API_URL}/images/${marker.imageID}`} alt={marker.title} />
                            <p>Status: {getStatusText(marker.status)}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}

export default Map