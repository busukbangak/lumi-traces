import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import type { TraceData } from '../types/types'

interface MapEventHandlerProps {
    traces: TraceData[]
    onVisibleTracesUpdate: (visible: TraceData[]) => void
}

export const MapEventHandler: React.FC<MapEventHandlerProps> = ({ traces, onVisibleTracesUpdate }) => {
    const map = useMap()

    // Update visible traces on map move or zoom
    useEffect(() => {
        if (!map) return

        const updateVisibleMapMarkers = () => {
            try {
                const bounds = map.getBounds()
                const visibleTraces = traces.filter(m => bounds.contains([m.position[0], m.position[1]]))
                onVisibleTracesUpdate(visibleTraces)
            } catch {
                // ignore
            }
        }

        // initial check
        updateVisibleMapMarkers()

        map.on('moveend', updateVisibleMapMarkers)
        map.on('zoomend', updateVisibleMapMarkers)

        return () => {
            map.off('moveend', updateVisibleMapMarkers)
            map.off('zoomend', updateVisibleMapMarkers)
        }
    }, [map, traces, onVisibleTracesUpdate])

    return null
}