import L from "leaflet"
import { TraceType } from "../types/types"

// Get marker icon based on traceType
export const getMarkerIcon = (traceType: TraceType) => {
    switch (traceType) {
        case TraceType.Adventure:
            return new L.Icon({
                iconUrl: '/images/adventure-trace.png',
                iconSize: [83, 73],
                iconAnchor: [41, 73],
                popupAnchor: [0, -73],
                shadowUrl: '/images/drop-shadow.png',
                shadowSize: [120, 48],
                shadowAnchor: [60, 28],
            })
        case TraceType.Knowledge:
            return new L.Icon({
                iconUrl: '/images/knowledge-trace.png',
                iconSize: [88, 74],
                iconAnchor: [44, 74],
                popupAnchor: [0, -74],
                shadowUrl: '/images/drop-shadow.png',
                shadowSize: [128, 50],
                shadowAnchor: [59, 31],
            })
        default:
            return new L.Icon({
                iconUrl: '/images/adventure-trace.png',
                iconSize: [83, 73],
                iconAnchor: [41, 73],
                popupAnchor: [0, -73],
                shadowUrl: '/images/drop-shadow.png',
                shadowSize: [120, 48],
                shadowAnchor: [60, 28],
            })
    }
}


// Convert date to YYYY-MM-DD format for input[type="date"]
export const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "";

    return date.toISOString().split('T')[0]
}