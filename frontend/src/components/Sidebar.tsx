import React from 'react'
import { statusText } from '../utils/utils'
import type { TraceData } from '../types/types'

interface SidebarProps {
  visibleMarkers: TraceData[]
}

function Sidebar({ visibleMarkers }: SidebarProps) {

  return (
    <aside className="w-80 bg-white border-r overflow-y-auto p-4">
      <h2 className="text-lg font-semibold mb-2">Visible traces ({visibleMarkers.length})</h2>
      {visibleMarkers.length === 0 ? (
        <p className="text-sm text-gray-500">No images in view — pan or zoom the map.</p>
      ) : (
        <div className="space-y-4">
          {visibleMarkers.map(marker => (
            <div key={marker.id} className="border rounded overflow-hidden">
              <img src={marker.image} alt={marker.title} className="w-full h-36 object-cover" />
              <div className="p-2">
                <div className="font-medium">{marker.title}</div>
                <div className="text-sm text-gray-600">{statusText(marker.status)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}

export default Sidebar