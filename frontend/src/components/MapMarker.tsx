import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { TraceType, type Trace } from "../types/types";
import { getMarkerIcon } from "../utils/utils";

interface TraceProps {
    trace: Trace
}

export default function MapMarker({ trace }: TraceProps) {
    return (<Marker key={trace._id} position={trace.position} icon={getMarkerIcon(trace.traceType as TraceType)}>
        <Popup>
            <div>
                <h3>{trace.title}</h3>
                <p>{trace.description}</p>
                <img src={`${import.meta.env.VITE_API_URL}/images/${trace.imageID}`} alt={trace.title} />
                <p>Status: {trace.status}</p>
            </div>
        </Popup>
    </Marker>
    );
}