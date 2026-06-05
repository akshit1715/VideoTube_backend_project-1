import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { clearUser } from "../store/authSlice.js"
import { logoutUser } from "../api/auth.api.js"

function Navbar() {
    const { user, isAuthenticated } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logoutUser()
            dispatch(clearUser())
            navigate("/login")
        } catch (err) {
            console.error("Logout failed", err)
        }
    }

    return (
        <nav className="bg-gray-900 px-6 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-gray-700">
            <Link to="/" className="text-2xl font-bold text-white">
                Video<span className="text-red-500">Tube</span>
            </Link>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <>
                        <img
                            src={user?.avatar}
                            alt={user?.username}
                            className="w-9 h-9 rounded-full object-cover cursor-pointer"
                            onClick={() => navigate(`/channel/${user?.username}`)}
                        />
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
                        >
                            Logout
                        </button>
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