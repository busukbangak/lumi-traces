import { useState, useRef, useEffect } from 'react'
import type { ExifData, Trace } from '../types/types'
import { TraceStatus, TraceType } from '../types/types'
import axios from 'axios'
import { useAppSelector, useAppDispatch } from '../hooks/hooks'
import { formatDateForInput } from '../utils/utils'
import { disableMapInteractions, enableMapInteractions } from '../store/slices/uiSlice'
import exifr from 'exifr'

interface EditTraceFormProps {
    trace: Trace
    onSave: () => void
    onCancel: () => void
    onDelete: () => Promise<void>
}

export default function EditTraceForm({ trace, onSave, onCancel, onDelete }: EditTraceFormProps) {
    const dispatch = useAppDispatch()
    const { token } = useAppSelector(state => state.auth)

    // Form state
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [formData, setFormData] = useState({
        title: trace.title,
        description: trace.description,
        status: trace.status,
        traceType: trace.traceType,
        position: trace.position,
        tracker: trace.tracker,
        dateSpotted: formatDateForInput(trace.dateSpotted),
        imageID: trace.imageID
    })

    // State for new image upload
    const [newImage, setNewImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    // State for image EXIF data
    const [imageGPS, setImageGPS] = useState<{ lat: number; lng: number } | null>(null)
    const [imageDateTaken, setImageDateTaken] = useState<string | null>(null)
    const [gpsHint, setGpsHint] = useState<string | null>(null)
    const [dateHint, setDateHint] = useState<string | null>(null)

    // Process EXIF data and update state
    const processExifData = (exifData: ExifData | undefined, currentPosition: [number, number], currentDate: string) => {
        if (exifData) {
            console.log('=== Image EXIF Metadata ===')
            console.log('Full EXIF data:', exifData)

            // Handle GPS data
            if (typeof exifData.latitude === 'number' && typeof exifData.longitude === 'number') {
                console.log('GPS Coordinates:', exifData.latitude, exifData.longitude)
                if (exifData.altitude) console.log('Altitude:', exifData.altitude)

                setImageGPS({ lat: exifData.latitude, lng: exifData.longitude })

                // Check if current position differs from image GPS
                const latDiff = Math.abs(currentPosition[0] - exifData.latitude)
                const lngDiff = Math.abs(currentPosition[1] - exifData.longitude)
                if (latDiff > 0.0001 || lngDiff > 0.0001) {
                    setGpsHint('Position differs from image GPS data')
                } else {
                    setGpsHint(null)
                }
            } else {
                console.log('No GPS data found in image')
                setImageGPS(null)
                setGpsHint('This image does not contain GPS data')
            }

            // Handle date taken
            if (exifData.DateTimeOriginal) {
                console.log('Date taken:', exifData.DateTimeOriginal)
                const dateTaken = new Date(exifData.DateTimeOriginal)
                const formattedDate = formatDateForInput(dateTaken.toISOString())
                setImageDateTaken(formattedDate)

                // Check if current date differs from image date
                if (currentDate !== formattedDate) {
                    setDateHint('Date differs from image date taken')
                } else {
                    setDateHint(null)
                }
            } else {
                setImageDateTaken(null)
                setDateHint('This image does not contain date information')
            }

        } else {
            console.log('No EXIF data found in image')
            setImageGPS(null)
            setImageDateTaken(null)
            setGpsHint('This image does not contain metadata')
            setDateHint('This image does not contain metadata')
        }
    }

    // Disable map interactions when modal opens
    useEffect(() => {
        dispatch(disableMapInteractions())
        
        return () => {
            dispatch(enableMapInteractions())
        }
    }, [dispatch])

    // Check current image EXIF data on mount
    useEffect(() => {
        const checkCurrentImageExif = async () => {
            try {
                // Fetch the current image as a blob
                const response = await fetch(`${import.meta.env.VITE_API_URL}/images/${trace.imageID}`)
                const blob = await response.blob()

                // Parse EXIF data
                const exifData = await exifr.parse(blob)
                processExifData(exifData, trace.position, formatDateForInput(trace.dateSpotted))
            } catch (err) {
                console.warn('Failed to read current image EXIF data:', err)
            }
        }

        checkCurrentImageExif()
    }, [trace.imageID, trace.position, trace.dateSpotted])

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setNewImage(file)

            // Reset hints when new image is selected
            setGpsHint(null)
            setDateHint(null)

            // Read EXIF data
            try {
                const exifData = await exifr.parse(file)
                processExifData(exifData, formData.position, formData.dateSpotted)
            } catch (err) {
                console.warn('Failed to read EXIF data:', err)
                setImageGPS(null)
                setImageDateTaken(null)
                setGpsHint('Failed to read image metadata')
                setDateHint('Failed to read image metadata')
            }

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveNewImage = async () => {
        setNewImage(null)
        setImagePreview(null)

        // Clear the file input so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }

        // Re-check the current/original image EXIF data
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/images/${trace.imageID}`)
            const blob = await response.blob()
            const exifData = await exifr.parse(blob)
            processExifData(exifData, formData.position, formData.dateSpotted)
        } catch (err) {
            console.warn('Failed to re-read current image EXIF data:', err)
            setImageGPS(null)
            setImageDateTaken(null)
            setGpsHint(null)
            setDateHint(null)
        }
    }

    const handleResetGPS = () => {
        if (imageGPS) {
            setFormData({
                ...formData,
                position: [imageGPS.lat, imageGPS.lng]
            })
            setGpsHint(null)
        }
    }

    const handleResetDate = () => {
        if (imageDateTaken) {
            setFormData({
                ...formData,
                dateSpotted: imageDateTaken
            })
            setDateHint(null)
        }
    }

    // Check for position changes
    const handlePositionChange = (lat: number, lng: number) => {
        setFormData({
            ...formData,
            position: [lat, lng]
        })

        // Check if position differs from image GPS
        if (imageGPS) {
            const latDiff = Math.abs(lat - imageGPS.lat)
            const lngDiff = Math.abs(lng - imageGPS.lng)
            if (latDiff > 0.0001 || lngDiff > 0.0001) {
                setGpsHint('Position differs from image GPS data')
            } else {
                setGpsHint(null)
            }
        }
    }

    // Check for date changes
    const handleDateChange = (date: string) => {
        setFormData({
            ...formData,
            dateSpotted: date
        })

        // Check if date differs from image date
        if (imageDateTaken && date !== imageDateTaken) {
            setDateHint('Date differs from image date taken')
        } else if (imageDateTaken) {
            setDateHint(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            let updatedImageID = formData.imageID
            const oldImageID = formData.imageID

            // If new image selected, upload it first
            if (newImage) {
                const imageFormData = new FormData()
                imageFormData.append('image', newImage)

                const imageResponse = await axios.post(
                    `${import.meta.env.VITE_API_URL}/images`,
                    imageFormData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )
                updatedImageID = imageResponse.data.imageID
            }

            // Update trace with new data (and possibly new imageID)
            await axios.put(
                `${import.meta.env.VITE_API_URL}/traces/${trace._id}`,
                { ...formData, imageID: updatedImageID },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            // Delete old image from GridFS if a new one was uploaded
            if (newImage && oldImageID !== updatedImageID) {
                try {
                    await axios.delete(
                        `${import.meta.env.VITE_API_URL}/images/${oldImageID}`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    )
                } catch (deleteErr) {
                    // Log but don't fail the update if image deletion fails
                    console.warn('Failed to delete old image:', deleteErr)
                }
            }

            onSave()
        } catch (err) {
            console.error('Failed to update trace:', err)
            const error = err as { response?: { data?: { error?: string } } }
            setError(error.response?.data?.error || 'Failed to update trace')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Track where mouse down and mouse up occurred to prevent accidental closes
    const mouseDownOnModalRef = useRef(false)
    const mouseUpOnModalRef = useRef(false)

    const handleModalMouseDown = (e: React.MouseEvent) => {
        // Mark that mouse down happened on modal
        if (e.target === e.currentTarget) {
            mouseDownOnModalRef.current = true
        }
    }

    const handleModalMouseUp = (e: React.MouseEvent) => {
        // Track if mouse up also happened on modal
        if (e.target === e.currentTarget) {
            mouseUpOnModalRef.current = true
        } else {
            mouseUpOnModalRef.current = false
        }
    }

    const handleModalClick = (e: React.MouseEvent) => {
        // Only close Modal if BOTH mousedown AND mouseup happened on backdrop
        if (e.target === e.currentTarget &&
            mouseDownOnModalRef.current &&
            mouseUpOnModalRef.current) {
            onCancel()
        }
        // Reset for next interaction
        mouseDownOnModalRef.current = false
        mouseUpOnModalRef.current = false
    }

    return (
        <div
            className="modal-overlay fixed inset-0 z-[2000] flex items-center justify-center bg-black/50"
            onMouseDown={handleModalMouseDown}
            onMouseUp={handleModalMouseUp}
            onClick={handleModalClick}
        >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-2xl font-bold">Edit Trace</h2>

                {error && (
                    <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            rows={3}
                            required
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            {Object.values(TraceStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Trace Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Trace Type</label>
                        <select
                            value={formData.traceType}
                            onChange={(e) => setFormData({ ...formData, traceType: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            {Object.values(TraceType).map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Position */}
                    <div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Latitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.position[0]}
                                    onChange={(e) => handlePositionChange(parseFloat(e.target.value), formData.position[1])}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Longitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.position[1]}
                                    onChange={(e) => handlePositionChange(formData.position[0], parseFloat(e.target.value))}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                    required
                                />
                            </div>
                        </div>
                        {gpsHint && (
                            <div className="mt-2 flex items-center justify-between rounded bg-yellow-50 border border-yellow-200 px-3 py-2">
                                <span className="text-sm text-yellow-800">{gpsHint}</span>
                                {imageGPS && (
                                    <button
                                        type="button"
                                        onClick={handleResetGPS}
                                        className="ml-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Reset to image GPS
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tracker */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tracker</label>
                        <input
                            type="text"
                            value={formData.tracker}
                            onChange={(e) => setFormData({ ...formData, tracker: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    {/* Date Spotted */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date Spotted</label>
                        <input
                            type="date"
                            value={formData.dateSpotted}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        />
                        {dateHint && (
                            <div className="mt-2 flex items-center justify-between rounded bg-yellow-50 border border-yellow-200 px-3 py-2">
                                <span className="text-sm text-yellow-800">{dateHint}</span>
                                {imageDateTaken && (
                                    <button
                                        type="button"
                                        onClick={handleResetDate}
                                        className="ml-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Reset to image date
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Current Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
                        {!imagePreview && (
                            <img
                                src={`${import.meta.env.VITE_API_URL}/images/${formData.imageID}`}
                                alt="Current trace"
                                className="w-full h-auto rounded mb-2"
                            />
                        )}
                        {imagePreview && (
                            <div>
                                <img
                                    src={imagePreview}
                                    alt="New preview"
                                    className="w-full h-auto rounded mb-2"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveNewImage}
                                    className="text-sm text-red-600 hover:text-red-700"
                                >
                                    Remove new image
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Upload New Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Change Image (Optional)</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                        <p className="mt-1 text-xs text-gray-500">Upload a new image to replace the current one</p>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3 pt-4">
                        <button
                            type="button"
                            onClick={async () => {
                                await onDelete()
                                onCancel()
                            }}
                            disabled={isSubmitting}
                            className="w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-400"
                        >
                            Delete Trace
                        </button>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={isSubmitting}
                                className="flex-1 rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 disabled:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}
