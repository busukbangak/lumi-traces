import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { logout } from '../store/slices/authSlice'

export default function LogoutButton() {
    const dispatch = useAppDispatch()
    const { isAuthenticated, user } = useAppSelector(state => state.auth)

    if (!isAuthenticated) {
        return null
    }

    const handleLogout = () => {
        dispatch(logout())
    }

    return (
        <div className="fixed bottom-4 left-4 z-[1000] flex items-center gap-3 bg-white rounded-lg shadow-lg px-4 py-2 border border-gray-200">
            <div className="text-sm">
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
    )
}
