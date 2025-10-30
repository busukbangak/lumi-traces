import { useEffect } from 'react'
import type { Trace } from '../types/types'
import { useVisibleTraces } from '../hooks/useVisibleTraces'

interface MapEventHandlerProps {
    traces: Trace[]
    onVisibleTracesUpdate: (visible: Trace[]) => void
}

export default function MapEventHandler({ traces, onVisibleTracesUpdate }: MapEventHandlerProps) {
    const visibleTraces = useVisibleTraces(traces)

    // Update visible traces via hook
    useEffect(() => {
        onVisibleTracesUpdate(visibleTraces)
    }, [visibleTraces, onVisibleTracesUpdate])

    return null
}