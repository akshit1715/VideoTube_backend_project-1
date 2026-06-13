import { useState } from "react"
import { useSelector } from "react-redux"
import { getUserPlaylists, addVideoToPlaylist } from "../api/playlist.api.js"

function AddToPlaylist({ videoId }) {
    const { user } = useSelector((state) => state.auth)
    const [playlists, setPlaylists] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [message, setMessage] = useState("")
    const [addedIds, setAddedIds] = useState([])

    const handleOpen = async () => {
        if (!showDropdown) {
            const res = await getUserPlaylists(user._id)
            const data = res.data.data || []
            setPlaylists(data)
            // mark which playlists already have this video
            setAddedIds(data.filter(p => p.videos?.includes(videoId)).map(p => p._id))
        }
        setShowDropdown(!showDropdown)
    }

    const handleAdd = async (playlistId) => {
        if (addedIds.includes(playlistId)) return
        try {
            await addVideoToPlaylist(videoId, playlistId)
            setAddedIds([...addedIds, playlistId])
            setMessage("Added to playlist!")
            setTimeout(() => setMessage(""), 2000)
        } catch (err) {
            console.error("Failed to add to playlist", err)
        }
    }

    return (
        <div className="relative">
            <button
                onClick={handleOpen}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition"
            >
                + Save
            </button>

            {message && <p className="text-green-400 text-sm mt-1">{message}</p>}

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg z-50 py-2">
                    <p className="text-gray-400 text-xs px-4 py-1">Save to playlist</p>
                    {playlists.length === 0 && (
                        <p className="text-gray-500 text-sm px-4 py-2">No playlists found</p>
                    )}
                    {playlists.map((playlist) => (
                        <button
                            key={playlist._id}
                            onClick={() => handleAdd(playlist._id)}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between
                                ${addedIds.includes(playlist._id)
                                    ? "text-green-400 cursor-default"
                                    : "text-white hover:bg-gray-700"
                                }`}
                        >
                            <span>📋 {playlist.name}</span>
                            {addedIds.includes(playlist._id) && <span>✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AddToPlaylist