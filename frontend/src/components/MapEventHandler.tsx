import { useEffect } from 'react'
import { useAppDispatch, useAppSelector, useVisibleTraces } from '../hooks/hooks'
import { setVisibleTraces } from '../store/slices/tracesSlice'

export default function MapEventHandler() {
    const dispatch = useAppDispatch()
    const traces = useAppSelector(state => state.traces.items)
    const visibleTraces = useVisibleTraces(traces)

    // Push visible traces into redux on change
    useEffect(() => {
        dispatch(setVisibleTraces(visibleTraces))
    }, [dispatch, visibleTraces])

    return null
}