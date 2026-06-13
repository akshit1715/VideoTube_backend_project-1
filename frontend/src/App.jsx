import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser, clearUser } from "./store/authSlice.js"
import { getCurrentUser } from "./api/auth.api.js"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Home from "./pages/Home.jsx"
import VideoPlayer from "./pages/VideoPlayer.jsx"
import Channel from "./pages/Channel.jsx"
import UploadVideo from "./pages/UploaadVideo.jsx"
import EditProfile from "./pages/EditProfile.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import LikedVideos from "./pages/LikedVideos.jsx"
import WatchHistory from "./pages/WatchHistory.jsx"
import Playlists from "./pages/Playlists.jsx"
import PlaylistDetails from "./pages/PlaylistDetails.jsx"
import NotFound from "./pages/NotFound.jsx"
function App() {
    const dispatch = useDispatch()
    const [showSplash, setShowSplash] = useState(true)
    const [fadeOut, setFadeOut] = useState(false)

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await getCurrentUser()
                dispatch(setUser(res.data.data))
            } catch (err) {
                dispatch(clearUser())
            }
        }
        fetchCurrentUser()

        // Start fade out at 1.5s, hide at 2s
        const fadeTimer = setTimeout(() => setFadeOut(true), 1500)
        const hideTimer = setTimeout(() => setShowSplash(false), 2000)
        return () => {
            clearTimeout(fadeTimer)
            clearTimeout(hideTimer)
        }
    }, [])

    if (showSplash) return (
        <div
            className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-4"
            style={{ transition: "opacity 0.5s ease", opacity: fadeOut ? 0 : 1 }}
        >
            <h1 className="text-6xl font-bold text-white tracking-tight">
                Video<span className="text-red-500">Tube</span>
            </h1>
            <p className="text-gray-400 text-sm tracking-widest uppercase">Watch. Share. Enjoy.</p>
            <div className="mt-6 w-10 h-10 border-4 border-gray-600 border-t-red-500 rounded-full animate-spin" />
        </div>
    )

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/watch/:videoId" element={<VideoPlayer />} />
                <Route path="/channel/:username" element={<Channel />} />
                <Route path="/upload" element={
                    <ProtectedRoute><UploadVideo /></ProtectedRoute>
                } />
                <Route path="/edit-profile" element={
                    <ProtectedRoute><EditProfile /></ProtectedRoute>
                } />
                <Route path="/liked-videos" element={
                    <ProtectedRoute><LikedVideos /></ProtectedRoute>
                } />
                <Route path="/watch-history" element={
                    <ProtectedRoute><WatchHistory /></ProtectedRoute>
                } />
                <Route path="/playlists" element={
                    <ProtectedRoute><Playlists /></ProtectedRoute>
                } />
                <Route path="/playlist/:playlistId" element={
                    <ProtectedRoute><PlaylistDetails /></ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App