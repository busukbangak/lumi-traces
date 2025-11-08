import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { TraceType, type Trace } from "../types/types";
import { getMarkerIcon } from "../utils/utils";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import axios from "axios";
import { fetchTraces } from "../store/slices/tracesSlice";

interface TraceProps {
    trace: Trace
}

export default function MapTraceMarker({ trace }: TraceProps) {
    const dispatch = useAppDispatch()
    const { isAuthenticated, token } = useAppSelector(state => state.auth)

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete "${trace.title}"?`)) {
            return
        }

        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/traces/${trace._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            // Refresh traces list
            dispatch(fetchTraces())
        } catch (error) {
            console.error('Failed to delete trace:', error)
            alert('Failed to delete trace. Please check your permissions.')
        }
    }

    return (
        <Marker key={trace._id} position={trace.position} icon={getMarkerIcon(trace.traceType as TraceType)}>
            <Popup>
                <div>
                    <h3 className="font-bold text-lg mb-2">{trace.title}</h3>
                    <p className="mb-2">{trace.description}</p>
                    <img
                        src={`${import.meta.env.VITE_API_URL}/images/${trace.imageID}`}
                        alt={trace.title}
                        className="w-full h-auto rounded mb-2"
                    />
                    <p className="text-sm text-gray-600">Status: {trace.status}</p>

                    {isAuthenticated && (
                        <button
                            onClick={handleDelete}
                            className="mt-3 w-full rounded bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                        >
                            Delete Trace
                        </button>
                    )}
                </div>
            </Popup>
        </Marker>
    );
}