import { useState, useEffect } from 'react'

export default function WelcomeOverlay() {
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        // Check if user has seen the welcome message before
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
        if (!hasSeenWelcome) {
            setIsExpanded(true)
        } else {
            setIsExpanded(false)
        }
    }, [])

    const handleDismiss = () => {
        localStorage.setItem('hasSeenWelcome', 'true')
        setIsExpanded(false)
    }

    const handleToggle = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className="fixed bottom-4 left-4 z-[1000] max-w-md">
            {isExpanded ? (
                <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-blue-500">
                    <div className="flex items-start justify-between mb-4">
                        <h2 className="text-xl font-bold text-blue-600">Welcome to Lumi Traces! 🌟</h2>
                        <button
                            onClick={handleDismiss}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-3 text-sm text-gray-700">
                        <p className="font-medium">
                            Track and discover traces on an interactive map!
                        </p>

                        <div className="space-y-2">
                            <div className="flex items-start">
                                <span className="text-blue-500 mr-2">📍</span>
                                <span><strong>View Traces:</strong> Click on any marker to see details</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-blue-500 mr-2">➕</span>
                                <span><strong>Add Trace:</strong> Use the blue button to add new traces</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-blue-500 mr-2">📋</span>
                                <span><strong>Sidebar:</strong> See all visible traces in the current map view</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-blue-500 mr-2">🔍</span>
                                <span><strong>Navigation:</strong> Pan and zoom the map to explore different areas</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-blue-500 mr-2">🖼️</span>
                                <span><strong>Image Preview:</strong> Click on images to view them in full size</span>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 italic">
                                Tip: Click markers in the sidebar to fly to their location on the map!
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleDismiss}
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                        Got it!
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleToggle}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg transition-all flex items-center gap-2"
                    title="Show welcome message"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                    </svg>
                    <span>Help</span>
                </button>
            )}
        </div>
    )
}
