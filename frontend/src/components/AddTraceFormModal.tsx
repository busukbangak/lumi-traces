import { useState, useRef, useEffect } from 'react'
import type { ExifData } from '../types/types'
import { TraceStatus, TraceType } from '../types/types'
import axios from 'axios'
import { useAppSelector, useAppDispatch } from '../hooks/hooks'
import { formatDateForInput } from '../utils/utils'
import { disableMapInteractions, enableMapInteractions } from '../store/slices/uiSlice'
import exifr from 'exifr'
import ReCAPTCHA from 'react-google-recaptcha'

// TODO: Maybe unify code with EditTraceFormModal.tsx

interface AddTraceFormModalProps {
    onSave: () => void
    onCancel: () => void
}

export default function AddTraceFormModal({ onSave, onCancel }: AddTraceFormModalProps) {
    const dispatch = useAppDispatch()
    const { token, user } = useAppSelector(state => state.auth)
    const isAdmin = user?.role === 'admin'

    // Form state
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: TraceStatus.PENDING,
        traceType: TraceType.Adventure,
        position: [0, 0] as [number, number],
        tracker: '',
        dateSpotted: formatDateForInput(new Date().toISOString()),
        recaptchaToken: null as string | null,
    })

    // State for image upload
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    // State for image EXIF data
    const [imageGPS, setImageGPS] = useState<{ lat: number; lng: number } | null>(null)
    const [imageDateTaken, setImageDateTaken] = useState<string | null>(null)
    const [gpsHint, setGpsHint] = useState<string | null>(null)
    const [dateHint, setDateHint] = useState<string | null>(null)

    // Process EXIF data and update state
    const processExifData = (exifData: ExifData | undefined) => {
        if (exifData) {
            console.log('=== Image EXIF Metadata ===')
            console.log('Full EXIF data:', exifData)

            // Handle GPS data
            if (typeof exifData.latitude === 'number' && typeof exifData.longitude === 'number') {
                console.log('GPS Coordinates:', exifData.latitude, exifData.longitude)
                if (exifData.altitude) console.log('Altitude:', exifData.altitude)

                setImageGPS({ lat: exifData.latitude, lng: exifData.longitude })

                // Auto-fill position from image GPS
                setFormData(prev => ({
                    ...prev,
                    position: [exifData.latitude!, exifData.longitude!]
                }))
                setGpsHint(null)
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

                // Auto-fill date
                setFormData(prev => ({
                    ...prev,
                    dateSpotted: formattedDate
                }))
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

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)

            // Reset hints when new image is selected
            setGpsHint(null)
            setDateHint(null)

            // Read EXIF data
            try {
                const exifData = await exifr.parse(file)
                processExifData(exifData)
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

    const handleRemoveImage = () => {
        setImage(null)
        setImagePreview(null)
        setImageGPS(null)
        setImageDateTaken(null)
        setGpsHint(null)
        setDateHint(null)

        // Clear the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
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

        if (!image) {
            setError('Please select an image')
            setIsSubmitting(false)
            return
        }

        // Only require reCAPTCHA if not authenticated
        if (!token && !formData.recaptchaToken) {
            setError('Please complete the reCAPTCHA verification')
            setIsSubmitting(false)
            return
        }

        try {
            // Create form data for trace
            const traceFormData = new FormData()
            traceFormData.append('image', image)
            traceFormData.append('title', formData.title)
            traceFormData.append('description', formData.description)
            traceFormData.append('status', formData.status)
            traceFormData.append('traceType', formData.traceType)
            traceFormData.append('position', JSON.stringify(formData.position))
            traceFormData.append('tracker', formData.tracker)
            traceFormData.append('dateSpotted', formData.dateSpotted)
            
            // Add reCAPTCHA token if not authenticated
            if (!token && formData.recaptchaToken) {
                traceFormData.append('recaptchaToken', formData.recaptchaToken)
            }

            await axios.post(
                `${import.meta.env.VITE_API_URL}/traces`,
                traceFormData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            onSave()
        } catch (err) {
            console.error('Failed to create trace:', err)
            const error = err as { response?: { data?: { error?: string } } }
            setError(error.response?.data?.error || 'Failed to create trace')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Track where mouse down and mouse up occurred to prevent accidental closes
    const mouseDownOnModalRef = useRef(false)
    const mouseUpOnModalRef = useRef(false)

    const handleModalMouseDown = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            mouseDownOnModalRef.current = true
        }
    }

    const handleModalMouseUp = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            mouseUpOnModalRef.current = true
        }
    }

    const handleModalClick = (e: React.MouseEvent) => {
        // Only close if BOTH mousedown AND mouseup happened on backdrop
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
            <div
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
            >
                <h2 className="mb-4 text-2xl font-bold">Add New Trace</h2>

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
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as TraceStatus })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            disabled={!isAdmin}
                        >
                            {Object.values(TraceStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        {!isAdmin && (
                            <p className="mt-1 text-sm text-gray-500">Only admins can change status</p>
                        )}
                    </div>

                    {/* Trace Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Trace Type</label>
                        <select
                            value={formData.traceType}
                            onChange={(e) => setFormData({ ...formData, traceType: e.target.value as TraceType })}
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

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image *</label>
                        {imagePreview ? (
                            <div>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-auto rounded mb-2"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="text-sm text-red-600 hover:text-red-700"
                                >
                                    Remove image
                                </button>
                            </div>
                        ) : (
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                required
                            />
                        )}
                    </div>

                    {/* reCAPTCHA - only show if not authenticated */}
                    {!token && (
                        <div className="flex justify-center">
                            <ReCAPTCHA
                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                onChange={(token) => setFormData({ ...formData, recaptchaToken: token })}
                                onExpired={() => setFormData({ ...formData, recaptchaToken: null })}
                            />
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Trace'}
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
                </form>
            </div>
        </div>
    )
}
