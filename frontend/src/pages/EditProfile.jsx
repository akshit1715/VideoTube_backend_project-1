import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setUser } from "../store/authSlice.js"
import api from "../api/axios.js"
import Navbar from "../components/Navbar.jsx"

function EditProfile() {
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [fullName, setFullName] = useState(user?.fullName || "")
    const [email, setEmail] = useState(user?.email || "")
    const [avatar, setAvatar] = useState(null)
    const [coverImage, setCoverImage] = useState(null)
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleUpdateDetails = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setMessage("")
        try {
            const res = await api.patch("/users/update-account", { fullName, email })
            dispatch(setUser(res.data.data))
            setMessage("Profile updated successfully!")
        } catch (err) {
            setError(err.response?.data?.message || "Update failed")
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateAvatar = async (e) => {
        e.preventDefault()
        if(!avatar) return
        setLoading(true)
        setError("")
        setMessage("")
        try {
            const data = new FormData()
            data.append("avatar", avatar)
            const res = await api.patch("/users/avatar", data)
            dispatch(setUser({ ...user, avatar: res.data.data }))
            setMessage("Avatar updated successfully!")
        } catch (err) {
            setError(err.response?.data?.message || "Avatar update failed")
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateCoverImage = async (e) => {
        e.preventDefault()
        if(!coverImage) return
        setLoading(true)
        setError("")
        setMessage("")
        try {
            const data = new FormData()
            data.append("coverImage", coverImage)
            const res = await api.patch("/users/cover-image", data)
            dispatch(setUser({ ...user, coverImage: res.data.data }))
            setMessage("Cover image updated successfully!")
        } catch (err) {
            setError(err.response?.data?.message || "Cover image update failed")
        } finally {
            setLoading(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setMessage("")
        try {
            await api.post("/users/change-password", { oldPassword, newPassword })
            setMessage("Password changed successfully!")
            setOldPassword("")
            setNewPassword("")
        } catch (err) {
            setError(err.response?.data?.message || "Password change failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="max-w-2xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-white mb-6">Edit Profile</h1>

                {message && <p className="text-green-500 mb-4">{message}</p>}
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Current Profile */}
                <div className="flex items-center gap-4 mb-8 p-4 bg-gray-800 rounded-lg">
                    <img
                        src={user?.avatar}
                        alt={user?.username}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                        <p className="text-white font-semibold">{user?.fullName}</p>
                        <p className="text-gray-400">@{user?.username}</p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                    </div>
                </div>

                {/* Update Name & Email */}
                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                    <h2 className="text-white font-semibold mb-4">Update Details</h2>
                    <form onSubmit={handleUpdateDetails} className="space-y-4">
                        <div>
                            <label className="text-gray-400 text-sm">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-gray-700 text-white p-3 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-700 text-white p-3 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
                        >
                            {loading ? "Updating..." : "Update Details"}
                        </button>
                    </form>
                </div>

                {/* Update Avatar */}
                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                    <h2 className="text-white font-semibold mb-4">Update Avatar</h2>
                    <form onSubmit={handleUpdateAvatar} className="space-y-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatar(e.target.files[0])}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg"
                        />
                        <button
                            type="submit"
                            disabled={loading || !avatar}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Avatar"}
                        </button>
                    </form>
                </div>

                {/* Update Cover Image */}
                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                    <h2 className="text-white font-semibold mb-4">Update Cover Image</h2>
                    <form onSubmit={handleUpdateCoverImage} className="space-y-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCoverImage(e.target.files[0])}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg"
                        />
                        <button
                            type="submit"
                            disabled={loading || !coverImage}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Cover Image"}
                        </button>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                    <h2 className="text-white font-semibold mb-4">Change Password</h2>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="text-gray-400 text-sm">Old Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full bg-gray-700 text-white p-3 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-gray-700 text-white p-3 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
                        >
                            {loading ? "Updating..." : "Change Password"}
                        </button>
                    </form>
                </div>

                <button
                    onClick={() => navigate(`/channel/${user?.username}`)}
                    className="text-gray-400 hover:text-white transition"
                >
                    ← Back to Channel
                </button>
            </div>
        </div>
    )
}

export default EditProfile