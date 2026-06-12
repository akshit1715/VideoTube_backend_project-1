import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { publishVideo } from "../api/video.api.js"
import Navbar from "../components/Navbar.jsx"

function UploadVideo() {
    const [formData, setFormData] = useState({ title: "", description: "" })
    const [videoFile, setVideoFile] = useState(null)
    const [thumbnail, setThumbnail] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [progress, setProgress] = useState("")

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setProgress("Uploading video...")

        try {
            const data = new FormData()
            data.append("title", formData.title)
            data.append("description", formData.description)
            data.append("videoFile", videoFile)
            data.append("thumbnail", thumbnail)

            const res = await publishVideo(data)
            setProgress("Upload complete!")
            navigate(`/video/${res.data.data._id}`)
        } catch (err) {
            setError(err.response?.data?.message || "Upload failed")
        } finally {
            setLoading(false)
            setProgress("")
        }
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="max-w-2xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-white mb-6">Upload Video</h1>

                {error && (
                    <p className="text-red-500 mb-4">{error}</p>
                )}
                {progress && (
                    <p className="text-green-500 mb-4">{progress}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-gray-400 text-sm">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter video title"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-red-500 h-32 resize-none"
                            placeholder="Enter video description"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm">Video File <span className="text-red-500">*</span></label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setVideoFile(e.target.files[0])}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg mt-1"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm">Thumbnail <span className="text-red-500">*</span></label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setThumbnail(e.target.files[0])}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg mt-1"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg font-semibold transition"
                    >
                        {loading ? "Uploading... Please wait" : "Upload Video"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UploadVideo