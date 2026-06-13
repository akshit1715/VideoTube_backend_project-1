import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getPlaylistById, removeVideoFromPlaylist } from "../api/playlist.api.js"
import Navbar from "../components/Navbar.jsx"

function PlaylistDetail() {
    const { playlistId } = useParams()
    const [playlist, setPlaylist] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const res = await getPlaylistById(playlistId)
                setPlaylist(res.data.data)
            } catch (err) {
                console.error("Failed to fetch playlist", err)
            } finally {
                setLoading(false)
            }
        }
        fetchPlaylist()
    }, [playlistId])

    const handleRemove = async (videoId) => {
        try {
            await removeVideoFromPlaylist(videoId, playlistId)
            setPlaylist(prev => ({
                ...prev,
                videos: prev.videos.filter(v => v._id !== videoId)
            }))
        } catch (err) {
            console.error("Failed to remove video", err)
        }
    }

    if (loading) return <div className="min-h-screen bg-gray-900"><Navbar /><p className="text-white text-center mt-10">Loading...</p></div>
    if (!playlist) return <div className="min-h-screen bg-gray-900"><Navbar /><p className="text-white text-center mt-10">Playlist not found</p></div>

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-8">
                <button
                    onClick={() => navigate("/playlists")}
                    className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1"
                >
                    ← Back to Playlists
                </button>

                <h1 className="text-2xl font-bold text-white mb-1">{playlist.name}</h1>
                <p className="text-gray-400 text-sm mb-6">{playlist.description}</p>

                {playlist.videos?.length === 0 && (
                    <p className="text-gray-500 text-center mt-10">No videos in this playlist yet.</p>
                )}

                <div className="space-y-4">
                    {playlist.videos?.map((video) => (
                        <div key={video._id} className="bg-gray-800 rounded-lg flex items-center gap-4 p-3">
                            {/* Thumbnail */}
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-36 h-20 object-cover rounded-lg flex-shrink-0 cursor-pointer"
                                onClick={() => navigate(`/watch/${video._id}`)}
                            />
                            {/* Info */}
                            <div
                                className="flex-1 cursor-pointer"
                                onClick={() => navigate(`/watch/${video._id}`)}
                            >
                                <h3 className="text-white font-semibold text-sm line-clamp-2">{video.title}</h3>
                                <p className="text-gray-400 text-xs mt-1">{video.owner?.fullName}</p>
                                <p className="text-gray-500 text-xs">{video.views} views</p>
                            </div>
                            {/* Remove button */}
                            <button
                                onClick={() => handleRemove(video._id)}
                                className="text-red-500 hover:text-red-400 text-sm flex-shrink-0"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PlaylistDetail