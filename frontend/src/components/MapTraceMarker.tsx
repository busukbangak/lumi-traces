import { useState } from "react";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { TraceType, type Trace } from "../types/types";
import { getMarkerIcon } from "../utils/utils";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import axios from "axios";
import { fetchTraces } from "../store/slices/tracesSlice";
import EditTraceForm from "./EditTraceForm";

interface TraceProps {
    trace: Trace
}

export default function MapTraceMarker({ trace }: TraceProps) {
    const dispatch = useAppDispatch()
    const { isAuthenticated, token, user } = useAppSelector(state => state.auth)
    const [isEditing, setIsEditing] = useState(false)

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

    const handleEditSave = () => {
        setIsEditing(false)
        dispatch(fetchTraces())
    }

    return (
        <>
            <Marker key={trace._id} position={trace.position} icon={getMarkerIcon(trace.traceType as TraceType)}>
                <Popup closeOnClick={true} autoClose={true}>
                    <div>
                        <h3 className="font-bold text-lg mb-2">{trace.title}</h3>
                        <p className="mb-2">{trace.description}</p>
                        <img
                            src={`${import.meta.env.VITE_API_URL}/images/${trace.imageID}`}
                            alt={trace.title}
                            className="w-full h-auto rounded mb-2"
                        />
                        <p className="text-sm text-gray-600 mb-2">Status: {trace.status}</p>
                        <p className="text-sm text-gray-600 mb-2">Tracker: {trace.tracker}</p>
                        <p className="text-sm text-gray-600">Date: {trace.dateSpotted}</p>

                        {isAuthenticated && user?.role === 'admin' &&(
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-3 w-full rounded bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </Popup>
            </Marker>

            {isEditing && (
                <EditTraceForm
                    trace={trace}
                    onSave={handleEditSave}
                    onCancel={() => setIsEditing(false)}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
}