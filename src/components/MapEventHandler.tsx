import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import type { MarkerData } from '../types/types'

interface MapEventHandlerProps {
    markers: MarkerData[]
    onVisibleMarkersUpdate: (visible: MarkerData[]) => void
}

export const MapEventHandler: React.FC<MapEventHandlerProps> = ({ markers, onVisibleMarkersUpdate }) => {
    const map = useMap()

    // Update visible markers on map move or zoom
    useEffect(() => {
        if (!map) return

        const updateVisibleMapMarkers = () => {
            try {
                const bounds = map.getBounds()
                const visibleMarkers = markers.filter(m => bounds.contains([m.position[0], m.position[1]]))
                onVisibleMarkersUpdate(visibleMarkers)
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
    }, [map, markers, onVisibleMarkersUpdate])

    return null
}