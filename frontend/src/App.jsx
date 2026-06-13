import { useState,useEffect } from "react"
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
function App() {
    const dispatch = useDispatch()
    const [showSplash, setShowSplash] = useState(true)

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
    const timer = setTimeout(() => setShowSplash(false), 2000)
        return () => clearTimeout(timer)
}, [])
 if (showSplash) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <h1 className="text-5xl font-bold text-white">
                Video<span className="text-red-500">Tube</span>
            </h1>
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
                    <ProtectedRoute>
                        <UploadVideo />
                    </ProtectedRoute>
                } />
                <Route path="/edit-profile" element={
                    <ProtectedRoute>
                        <EditProfile />
                    </ProtectedRoute>
                } />
                <Route path="/liked-videos" element={
                    <ProtectedRoute>
                        <LikedVideos />
                    </ProtectedRoute>
                } />
                <Route path="/watch-history" element={
                    <ProtectedRoute>
                        <WatchHistory />
                    </ProtectedRoute>
                } />
                <Route path="/playlists" element={
                    <ProtectedRoute>
                        <Playlists />
                    </ProtectedRoute>
                } />
                <Route path="/playlist/:playlistId" element={
                    <ProtectedRoute>
                        <PlaylistDetails />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default App