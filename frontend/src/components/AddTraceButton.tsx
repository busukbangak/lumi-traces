import { useState } from 'react'
import { useAppDispatch } from '../hooks/hooks'
import { fetchTraces } from '../store/slices/tracesSlice'
import AddTraceFormModal from './AddTraceFormModal'

export default function AddTraceButton() {
    const dispatch = useAppDispatch()
    const [showAddForm, setShowAddForm] = useState(false)

    const handleSave = () => {
        setShowAddForm(false)
        dispatch(fetchTraces()) // Reload traces after adding
    }

    return (
        <>
            {/* Add Trace Modal */}
            {showAddForm && (
                <AddTraceFormModal
                    onSave={handleSave}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

            {/* Add Trace Button - positioned relative to map */}
            <button
                onClick={() => setShowAddForm(true)}
                className="absolute bottom-6 right-4 z-[1000] bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors"
                title="Add New Trace"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        </>
    )
}
