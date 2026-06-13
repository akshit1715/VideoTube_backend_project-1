import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getLikedVideos } from "../api/like.api.js"
import Navbar from "../components/Navbar.jsx"
import VideoCard from "../components/VideoCard.jsx"

function LikedVideos() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchLikedVideos = async () => {
            try {
                const res = await getLikedVideos()
                const likedVideos = res.data.data.map(item => item.video)
                setVideos(likedVideos)
            } catch (err) {
                console.error("Failed to fetch liked videos", err)
            } finally {
                setLoading(false)
            }
        }
        fetchLikedVideos()
    }, [])

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-white mb-6">Liked Videos</h1>
                {loading && <p className="text-white text-center">Loading...</p>}
                {!loading && videos.length === 0 && (
                    <p className="text-gray-400 text-center">No liked videos yet</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        video && <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LikedVideos