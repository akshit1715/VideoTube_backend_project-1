import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "./store/authSlice.js"
import { getCurrentUser } from "./api/auth.api.js"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Home from "./pages/Home.jsx"
import VideoPlayer from "./pages/VideoPlayer.jsx"
import Channel from "./pages/Channel.jsx"

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await getCurrentUser()
                dispatch(setUser(res.data.message))
            } catch (err) {
                // user not logged in, do nothing
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
            </Routes>
        </BrowserRouter>
    )
}

export default App