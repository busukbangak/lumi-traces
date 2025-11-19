import { useState, useEffect } from "react"
import { useMap } from "react-leaflet"
import { useDispatch, type TypedUseSelectorHook, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store/store"
import type { Trace } from "../types/types"

export const useAppDispatch: () => AppDispatch = useDispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 1024) // lg breakpoint
        }

        // Initial check
        checkIsMobile()

        // Listen for resize events
        window.addEventListener('resize', checkIsMobile)

        return () => window.removeEventListener('resize', checkIsMobile)
    }, [])

    return isMobile
}

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
