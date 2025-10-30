import { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet'
import type { Trace } from '../types/types'

export function useVisibleTraces(traces: Trace[]) {
    const map = useMap()
    const [visibleTraces, setVisibleTraces] = useState<Trace[]>([])

    useEffect(() => {
        if (!map) return

        const updateVisible = () => {
            try {
                const bounds = map.getBounds()
                const tracesInView = traces.filter(trace => bounds.contains([trace.position[0], trace.position[1]]))
                setVisibleTraces(tracesInView)
            } catch {
                // ignore
            }
        }

        // initial check
        updateVisible()

        map.on('moveend', updateVisible)
        map.on('zoomend', updateVisible)

        return () => {
            map.off('moveend', updateVisible)
            map.off('zoomend', updateVisible)
        }
    }, [map, traces])

    return visibleTraces;
}
