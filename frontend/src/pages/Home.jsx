import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getAllVideos } from "../api/video.api.js"
import api from "../api/axios.js"
import Navbar from "../components/Navbar.jsx"
import VideoCard from "../components/VideoCard.jsx"

function Home() {
    const [videos, setVideos] = useState([])
    const [channels, setChannels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const location = useLocation()
    const navigate = useNavigate()

    const searchQuery = new URLSearchParams(location.search).get("search") || ""

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await getAllVideos(searchQuery ? { query: searchQuery } : {})
                setVideos(res.data.data.docs)

                // search channels if there's a query
                if(searchQuery){
                    try {
                        const channelRes = await api.get(`/users/c/${searchQuery}`)
                        setChannels([channelRes.data.data])
                    } catch {
                        setChannels([])
                    }
                } else {
                    setChannels([])
                }
            } catch (err) {
                setError("Failed to fetch videos")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [searchQuery])

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-8">
                {searchQuery && (
                    <h2 className="text-white text-xl mb-6">
                        Search results for: <span className="text-red-500">"{searchQuery}"</span>
                    </h2>
                )}

                {/* Channels section */}
                {channels.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-white text-lg font-semibold mb-4">Channels</h3>
                        <div className="flex flex-col gap-3">
                            {channels.map((channel) => (
                                <div
                                    key={channel._id}
                                    onClick={() => navigate(`/channel/${channel.username}`)}
                                    className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition"
                                >
                                    <img
                                        src={channel.avatar}
                                        alt={channel.username}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="text-white font-semibold">{channel.fullName}</p>
                                        <p className="text-gray-400">@{channel.username}</p>
                                        <p className="text-gray-400 text-sm">{channel.subscribersCount} subscribers</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {loading && <p className="text-white text-center">Loading videos...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {!loading && videos.length === 0 && !searchQuery && (
                    <p className="text-gray-400 text-center">No videos found</p>
                )}

                {/* Videos section */}
                {videos.length > 0 && (
                    <>
                        {searchQuery && <h3 className="text-white text-lg font-semibold mb-4">Videos</h3>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {videos.map((video) => (
                                <VideoCard key={video._id} video={video} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Home