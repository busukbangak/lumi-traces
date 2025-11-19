import { useEffect } from "react"
import { disableMapInteractions, enableMapInteractions } from "../store/slices/uiSlice"
import { useAppDispatch } from "../hooks/hooks"

interface ImagePreviewModalProps {
  imageUrl: string
  title: string
  onClose: () => void
}

export default function ImagePreviewModal({ imageUrl, title, onClose }: ImagePreviewModalProps) {
  const dispatch = useAppDispatch()

  // Disable map interactions when modal opens
  useEffect(() => {
    dispatch(disableMapInteractions())

    return () => {
      dispatch(enableMapInteractions())
    }
  }, [dispatch])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      {/* Image title - top left corner of page */}
      <div className="fixed top-4 left-4 text-white text-lg font-semibold">
        {title}
      </div>

      {/* Close button - top right corner of page */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 text-white hover:text-gray-300 transition-colors"
        title="Close (ESC)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        className="relative max-w-7xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
          onClick={onClose}
        />
      </div>
    </div>
  )
}
