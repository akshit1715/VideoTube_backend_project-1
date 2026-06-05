import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { registerUser } from "../api/auth.api.js"

function Register() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        username: "",
        password: ""
    })
    const [avatar, setAvatar] = useState(null)
    const [coverImage, setCoverImage] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        console.log("avatar:", avatar)  // ← add this
    console.log("formData:", formData)  // ← add this


        try {
            const data = new FormData()
            data.append("fullName", formData.fullName)
            data.append("email", formData.email)
            data.append("username", formData.username)
            data.append("password", formData.password)
            data.append("avatar", avatar)
            if(coverImage) data.append("coverImage", coverImage)

            await registerUser(data)
            navigate("/login")
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-white text-center mb-6">
                    Video<span className="text-red-500">Tube</span>
                </h1>
                <h2 className="text-xl text-white text-center mb-6">Register</h2>

                {error && (
                    <p className="text-red-500 text-center mb-4">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-gray-400 text-sm">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm">Avatar <span className="text-red-500">*</span></label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatar(e.target.files[0])}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg mt-1"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm">Cover Image <span className="text-gray-500">(optional)</span></label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCoverImage(e.target.files[0])}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg mt-1"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg font-semibold transition"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="text-gray-400 text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-red-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register