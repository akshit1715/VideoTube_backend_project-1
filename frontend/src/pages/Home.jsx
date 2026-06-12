import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { getAllVideos } from "../api/video.api.js"
import Navbar from "../components/Navbar.jsx"
import VideoCard from "../components/VideoCard.jsx"

function Home() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const location = useLocation()
    
    const searchQuery = new URLSearchParams(location.search).get("search") || ""

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true)
            try {
                const res = await getAllVideos(searchQuery ? { query: searchQuery } : {})
                setVideos(res.data.data.docs)
            } catch (err) {
                setError("Failed to fetch videos")
            } finally {
                setLoading(false)
            }
        }
        fetchVideos()
    }, [searchQuery])  // ← depend on searchQuery string, not location.search

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-8">
                {searchQuery && (
                    <h2 className="text-white text-xl mb-6">
                        Search results for: <span className="text-red-500">"{searchQuery}"</span>
                    </h2>
                )}
                {loading && (
                    <p className="text-white text-center">Loading videos...</p>
                )}
                {error && (
                    <p className="text-red-500 text-center">{error}</p>
                )}
                {!loading && videos.length === 0 && (
                    <p className="text-gray-400 text-center">No videos found</p>
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

export default Home