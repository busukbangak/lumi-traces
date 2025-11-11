import { useState, useRef } from "react";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { TraceType, type Trace } from "../types/types";
import { getMarkerIcon } from "../utils/utils";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import axios from "axios";
import { fetchTraces } from "../store/slices/tracesSlice";
import EditTraceForm from "./EditTraceForm";
import type { Marker as LeafletMarker } from "leaflet";
import emailTemplates from "../assets/emailTemplates.json";

interface TraceProps {
    trace: Trace
}

export default function MapTraceMarker({ trace }: TraceProps) {
    const dispatch = useAppDispatch()
    const { isAuthenticated, token, user } = useAppSelector(state => state.auth)
    const [isEditing, setIsEditing] = useState(false)
    const markerRef = useRef<LeafletMarker>(null)

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

    const handleClosePopup = () => {
        markerRef.current?.closePopup()
    }

    return (
        <>
            <Marker key={trace._id} position={trace.position} icon={getMarkerIcon(trace.traceType as TraceType)} ref={markerRef}>
                <Popup closeOnClick={true} autoClose={true} closeButton={false}>
                    <div>
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-lg flex-1">{trace.title}</h3>
                            <div className="flex gap-1 ml-2">
                                {isAuthenticated && user?.role === 'admin' && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="rounded-full p-1.5 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                                        title="Edit"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        const subject = encodeURIComponent(
                                            emailTemplates.reportIssue.subject.replace('{title}', trace.title)
                                        )
                                        const body = encodeURIComponent(
                                            emailTemplates.reportIssue.body
                                                .replace('{title}', trace.title)
                                                .replace('{id}', trace._id)
                                                .replace('{location}', `${trace.position[0]}, ${trace.position[1]}`)
                                                .replace('{dateSpotted}', trace.dateSpotted)
                                        )
                                        window.open(`mailto:${import.meta.env.VITE_REPORT_EMAIL}?subject=${subject}&body=${body}`, '_blank')
                                    }}
                                className="rounded-full p-1.5 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
                                title="Report Issue"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                                </svg>
                            </button>
                            <button
                                onClick={handleClosePopup}
                                className="rounded-full p-1.5 text-gray-500 hover:bg-gray-200 transition-colors"
                                title="Close"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                            </div>
                        </div>
                        <p className="mb-2">{trace.description}</p>
                        <img
                            src={`${import.meta.env.VITE_API_URL}/images/${trace.imageID}`}
                            alt={trace.title}
                            className="w-full h-auto rounded mb-2"
                        />
                        <p className="text-sm text-gray-600 mb-2">Status: {trace.status}</p>
                        <p className="text-sm text-gray-600 mb-2">Tracker: {trace.tracker}</p>
                        <p className="text-sm text-gray-600">Date: {trace.dateSpotted}</p>
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