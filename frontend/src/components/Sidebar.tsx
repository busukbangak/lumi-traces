import { useAppSelector, useAppDispatch } from '../hooks/hooks'
import type { RootState } from '../store/store'
import type { Trace } from '../types/types'
import { selectTrace } from '../store/slices/uiSlice'
import { logout } from '../store/slices/authSlice'

export default function Sidebar() {
  const dispatch = useAppDispatch()
  const visibleTraces = useAppSelector((state: RootState) => state.traces.visible)
  const selectedTraceId = useAppSelector((state: RootState) => state.ui.selectedTraceId)
  const { isAuthenticated, user } = useAppSelector(state => state.auth)

  const handleTraceClick = (traceId: string) => {
    console.log('Sidebar: Clicking trace', traceId)
    dispatch(selectTrace(traceId))
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <aside className="w-80 bg-white border-r flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
      <h2 className="text-lg font-semibold mb-2">Visible traces ({visibleTraces.length})</h2>
      {visibleTraces.length === 0 ? (
        <p className="text-sm text-gray-500">No traces in view — pan or zoom the map.</p>
      ) : (
        <div className="space-y-4">
          {visibleTraces.map((marker: Trace) => (
            <div
              key={marker._id}
              className={`border rounded overflow-hidden cursor-pointer transition-all ${selectedTraceId === marker._id
                ? 'ring-2 ring-blue-500 shadow-lg scale-105'
                : 'hover:shadow-lg hover:scale-102'
                }`}
              onClick={() => handleTraceClick(marker._id)}
            >
              <img src={`${import.meta.env.VITE_API_URL}/images/${marker.imageID}`} alt={marker.title} className="w-full h-36 object-cover" />
              <div className="p-2">
                <div className="font-medium">{marker.title}</div>
                <div className="text-sm text-gray-600">{marker.status}</div>
              </div>
            </div>
          )
          )}
        </div>
      )}
      </div>

      {/* Sticky logout button at bottom */}
      {isAuthenticated && (
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm flex-1">
              <span className="text-gray-600">Logged in as </span>
              <span className="font-semibold">{user?.username}</span>
              {user?.role === 'admin' && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}

