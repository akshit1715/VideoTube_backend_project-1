import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { clearUser } from "../store/authSlice.js"
import { logoutUser } from "../api/auth.api.js"

function Navbar() {
    const { user, isAuthenticated } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [showDropdown, setShowDropdown] = useState(false)

    const handleLogout = async () => {
        try {
            await logoutUser()
            dispatch(clearUser())
            navigate("/login")
        } catch (err) {
            console.error("Logout failed", err)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if(searchQuery.trim()){
            navigate(`/?search=${searchQuery}`)
            setSearchQuery("")
        }
    }

    return (
        <nav className="bg-gray-900 px-6 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-gray-700">
            <Link to="/" className="text-2xl font-bold text-white flex-shrink-0">
                Video<span className="text-red-500">Tube</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md mx-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search videos..."
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
                <button
                    type="submit"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm transition"
                >
                    🔍
                </button>
            </form>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <>
                        <button
                            onClick={() => navigate("/upload")}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition"
                        >
                            Upload
                        </button>

                        {/* Avatar with dropdown */}
                        <div className="relative">
                            <img
                                src={user?.avatar}
                                alt={user?.username}
                                className="w-9 h-9 rounded-full object-cover cursor-pointer ring-2 ring-transparent hover:ring-red-500 transition"
                                onClick={() => setShowDropdown(!showDropdown)}
                            />
                            {showDropdown && (
    <div className="absolute right-0 top-12 bg-gray-800 rounded-lg shadow-lg z-50 w-48 py-2">
        <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-white text-sm font-semibold">{user?.fullName}</p>
            <p className="text-gray-400 text-xs">@{user?.username}</p>
        </div>
        <button
            onClick={() => { navigate(`/channel/${user?.username}`); setShowDropdown(false) }}
            className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 text-sm"
        >
            👤 Your Channel
        </button>
        <button
            onClick={() => { navigate("/liked-videos"); setShowDropdown(false) }}
            className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 text-sm"
        >
            👍 Liked Videos
        </button>
        <button
            onClick={() => { navigate("/watch-history"); setShowDropdown(false) }}
            className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 text-sm"
        >
            🕐 Watch History
        </button>
        <button
            onClick={() => { navigate("/playlists"); setShowDropdown(false) }}
            className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 text-sm"
        >
            📋 Playlists
        </button>
        <button
            onClick={() => { navigate("/edit-profile"); setShowDropdown(false) }}
            className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 text-sm"
        >
            ✏️ Edit Profile
        </button>
        <div className="border-t border-gray-700 mt-2 pt-2">
            <button
                onClick={() => { handleLogout(); setShowDropdown(false) }}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700 text-sm"
            >
                🚪 Logout
            </button>
        </div>
    </div>
)}
                        </div>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="text-white hover:text-red-500 transition"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar