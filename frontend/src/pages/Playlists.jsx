import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { getUserPlaylists, createPlaylist, deletePlaylist, updatePlaylist } from "../api/playlist.api.js"
import Navbar from "../components/Navbar.jsx"

function Playlists() {
    const { user } = useSelector((state) => state.auth)
    const [playlists, setPlaylists] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [editingId, setEditingId] = useState(null)
    const [editName, setEditName] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const res = await getUserPlaylists(user._id)
                setPlaylists(res.data.data || [])
            } catch (err) {
                console.error("Failed to fetch playlists", err)
            } finally {
                setLoading(false)
            }
        }
        fetchPlaylists()
    }, [])

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            const res = await createPlaylist({ name, description })
            setPlaylists([...playlists, res.data.data])
            setName("")
            setDescription("")
            setShowCreate(false)
        } catch (err) {
            console.error("Failed to create playlist", err)
        }
    }

    const handleDelete = async (playlistId) => {
        try {
            await deletePlaylist(playlistId)
            setPlaylists(playlists.filter(p => p._id !== playlistId))
        } catch (err) {
            console.error("Failed to delete playlist", err)
        }
    }

    const handleEditStart = (playlist) => {
        setEditingId(playlist._id)
        setEditName(playlist.name)
        setEditDescription(playlist.description)
    }

    const handleEditSave = async (playlistId) => {
        try {
            const res = await updatePlaylist(playlistId, { name: editName, description: editDescription })
            setPlaylists(playlists.map(p => p._id === playlistId ? res.data.data : p))
            setEditingId(null)
        } catch (err) {
            console.error("Failed to update playlist", err)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white">Your Playlists</h1>
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
                    >
                        + New Playlist
                    </button>
                </div>

                {showCreate && (
                    <form onSubmit={handleCreate} className="bg-gray-800 p-6 rounded-lg mb-6 space-y-4">
                        <h2 className="text-white font-semibold">Create New Playlist</h2>
                        <div>
                            <label className="text-gray-400 text-sm">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-700 text-white p-3 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Playlist name"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-gray-700 text-white p-3 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-red-500 h-24 resize-none"
                                placeholder="Playlist description"
                                required
                            />
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition">Create</button>
                            <button type="button" onClick={() => setShowCreate(false)} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition">Cancel</button>
                        </div>
                    </form>
                )}

                {loading && <p className="text-white text-center">Loading...</p>}
                {!loading && playlists.length === 0 && (
                    <p className="text-gray-400 text-center">No playlists yet. Create one!</p>
                )}

                <div className="space-y-4">
                    {playlists.map((playlist) => (
                        <div key={playlist._id} className="bg-gray-800 p-4 rounded-lg">
                            {editingId === playlist._id ? (
                                // Edit mode
                                <div className="space-y-3">
                                    <input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full bg-gray-700 text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        className="w-full bg-gray-700 text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-red-500 h-16 resize-none"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditSave(playlist._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm transition"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded-lg text-sm transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View mode
                                <div className="flex items-center justify-between">
                                    <div className="cursor-pointer flex-1" onClick={() => navigate(`/playlist/${playlist._id}`)}>
                                        <h3 className="text-white font-semibold">{playlist.name}</h3>
                                        <p className="text-gray-400 text-sm">{playlist.description}</p>
                                        <p className="text-gray-500 text-xs mt-1">{playlist.videos?.length || 0} videos</p>
                                    </div>
                                    <div className="flex gap-3 ml-4">
                                        <button
                                            onClick={() => handleEditStart(playlist)}
                                            className="text-blue-400 hover:text-blue-300 text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(playlist._id)}
                                            className="text-red-500 hover:text-red-400 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Playlists