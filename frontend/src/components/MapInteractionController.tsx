import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { useAppSelector } from '../hooks/hooks'

export default function MapInteractionController() {
    const map = useMap()
    const mapInteractionsEnabled = useAppSelector(state => state.ui.mapInteractionsEnabled)

    useEffect(() => {
        if (!mapInteractionsEnabled) {
            // Disable all map interactions
            map.dragging.disable()
            map.touchZoom.disable()
            map.doubleClickZoom.disable()
            map.scrollWheelZoom.disable()
            map.boxZoom.disable()
            map.keyboard.disable()
            map.getContainer().style.cursor = 'default'
        } else {
            // Re-enable all map interactions
            map.dragging.enable()
            map.touchZoom.enable()
            map.doubleClickZoom.enable()
            map.scrollWheelZoom.enable()
            map.boxZoom.enable()
            map.keyboard.enable()
            map.getContainer().style.cursor = ''
        }
    }, [map, mapInteractionsEnabled])

    return null
}
