import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getVideoById } from "../api/video.api.js"
import Navbar from "../components/Navbar.jsx"

function VideoPlayer() {
    const { videoId } = useParams()
    const [video, setVideo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await getVideoById(videoId)
                setVideo(res.data.message)
            } catch (err) {
                setError("Failed to fetch video")
            } finally {
                setLoading(false)
            }
        }
        fetchVideo()
    }, [videoId])

    if(loading) return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <p className="text-white text-center mt-20">Loading...</p>
        </div>
    )

    if(error) return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <p className="text-red-500 text-center mt-20">{error}</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Video Player */}
                <video
                    src={video?.videoFile}
                    controls
                    className="w-full rounded-lg bg-black"
                    autoPlay
                />

                {/* Video Info */}
                <div className="mt-4">
                    <h1 className="text-white text-2xl font-bold">{video?.title}</h1>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-gray-400 text-sm">{video?.views} views</p>
                    </div>
                </div>

                {/* Owner Info */}
                <div className="flex items-center gap-3 mt-4 pb-4 border-b border-gray-700">
                    <img
                        src={video?.owner?.avatar}
                        alt={video?.owner?.username}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <p className="text-white font-semibold">{video?.owner?.fullName}</p>
                        <p className="text-gray-400 text-sm">@{video?.owner?.username}</p>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-4">
                    <p className="text-gray-300 text-sm">{video?.description}</p>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer