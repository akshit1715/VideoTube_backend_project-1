import { useEffect } from "react"
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

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
    const fetchCurrentUser = async () => {
        try {
            const res = await getCurrentUser()
            dispatch(setUser(res.data.data))
        } catch (err) {
            dispatch(clearUser())  // ← just clear user on 401, don't refresh
        }
    }
    fetchCurrentUser()
}, [])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/video/:videoId" element={<VideoPlayer />} />
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
            </Routes>
        </BrowserRouter>
    )
}

export default App