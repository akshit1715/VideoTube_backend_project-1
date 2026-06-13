import { useState, useEffect } from "react"
import api from "../api/axios.js"
import Navbar from "../components/Navbar.jsx"
import VideoCard from "../components/VideoCard.jsx"
import VideoCardSkeleton from "../components/VideoCardSkeleton.jsx"

function WatchHistory() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchWatchHistory = async () => {
            try {
                const res = await api.get("/users/watch-history")
                setVideos(res.data.data || [])
            } catch (err) {
                console.error("Failed to fetch watch history", err)
            } finally {
                setLoading(false)
            }
        }
        fetchWatchHistory()
    }, [])

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-white mb-6">Watch History</h1>

                {loading && (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
            <VideoCardSkeleton key={i} />
        ))}
    </div>
)}
                {!loading && videos.length === 0 && (
                    <p className="text-gray-400 text-center">No watch history yet</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default WatchHistory