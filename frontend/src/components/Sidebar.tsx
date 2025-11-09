import { useAppSelector } from '../hooks/hooks'
import type { RootState } from '../store/store'
import type { Trace } from '../types/types'

export default function Sidebar() {
  const visibleTraces = useAppSelector((state: RootState) => state.traces.visible)

  return (
    <aside className="w-80 bg-white border-r overflow-y-auto p-4">
      <h2 className="text-lg font-semibold mb-2">Visible traces ({visibleTraces.length})</h2>
      {visibleTraces.length === 0 ? (
        <p className="text-sm text-gray-500">No traces in view — pan or zoom the map.</p>
      ) : (
        <div className="space-y-4">
          {visibleTraces.map((marker: Trace) => (
            <div key={marker._id} className="border rounded overflow-hidden">
              <img src={`${import.meta.env.VITE_API_URL}/images/${marker.imageID}`} alt={marker.title} className="w-full h-36 object-cover" />
              <div className="p-2">
                <div className="font-medium">{marker.title}</div>
                <div className="text-sm text-gray-600">{marker.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}

