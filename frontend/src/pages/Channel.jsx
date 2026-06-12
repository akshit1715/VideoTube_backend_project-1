import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Navbar from "../components/Navbar.jsx"
import VideoCard from "../components/VideoCard.jsx"
import api from "../api/axios.js"


function Channel() {
    const { username } = useParams()
    const { user: loggedInUser } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    const [channel, setChannel] = useState(null)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [subscribed, setSubscribed] = useState(false)
    const [showUnsubscribeDropdown, setShowUnsubscribeDropdown] = useState(false)

    useEffect(() => {
        const fetchChannel = async () => {
            try {
                const res = await api.get(`/users/c/${username}`)
                setChannel(res.data.data)
                setSubscribed(res.data.data.isSubscribed)

                const videosRes = await api.get(`/videos?userId=${res.data.data._id}`)
                setVideos(videosRes.data.data.docs || [])
            } catch (err) {
                console.error("Failed to fetch channel", err)
            } finally {
                setLoading(false)
            }
        }
        fetchChannel()
    }, [username])

    useEffect(() => {
        const handleClickOutside = (e) =>{
            if(!e.target.closest(".subscribe-dropdown")){
            setShowUnsubscribeDropdown(false)
        }
        } 
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [])

    const handleSubscribe = async () => {
        try {
            await api.post(`/subscriptions/c/${channel._id}`)
            const res = await api.get(`/users/c/${username}`)
            setChannel(res.data.data)
            setSubscribed(res.data.data.isSubscribed)
        } catch (err) {
            console.error("Failed to toggle subscription", err)
        }
    }

    if(loading) return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <p className="text-white text-center mt-20">Loading...</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            {/* Cover Image */}
            <div className="w-full h-48 bg-gray-700 overflow-hidden">
                {channel?.coverImage ? (
                    <img
                        src={channel.coverImage}
                        alt="cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-700" />
                )}
            </div>

            {/* Channel Info */}
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex items-end gap-4 -mt-10">
                    <img
                        src={channel?.avatar}
                        alt={channel?.username}
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-900"
                    />
                    <div className="mb-2 flex-1">
                        <h1 className="text-white text-2xl font-bold">{channel?.fullName}</h1>
                        <p className="text-gray-400">@{channel?.username}</p>
                        <p className="text-gray-400 text-sm">
                            {channel?.subscribersCount} subscribers · {channel?.channelsSubscribedToCount} subscribed
                        </p>
                    </div>

                    {/* Subscribe Button */}
                    {loggedInUser?._id !== channel?._id && (
                        <div className="relative mb-2 subscribe-dropdown">
                            {subscribed ? (
    <>
        <button
            onClick={() => setShowUnsubscribeDropdown(!showUnsubscribeDropdown)}
            className="flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition bg-gray-700 text-white hover:bg-gray-600"
           
        >
            Subscribed
            <span className="text-xs">▼</span>
        </button>
        {showUnsubscribeDropdown && (
            <div className="absolute top-12 right-0 bg-gray-800 rounded-lg shadow-lg z-10 w-40">
                <button
                    onClick={async () => {
                        setShowUnsubscribeDropdown(false)
                        await handleSubscribe()
                    }}
                    className="w-full text-left px-4 py-3 text-white hover:bg-gray-700 rounded-lg text-sm"
                >
                    Unsubscribe
                </button>
            </div>
        )}
    </>
                            ) : (
                                <button
                                    onClick={handleSubscribe}
                                    className="px-6 py-2 rounded-full font-semibold transition bg-red-500 text-white hover:bg-red-600"
                                >
                                    Subscribe
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {/* Videos */}
<div className="mt-8">
    <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-semibold">Videos</h2>
        {loggedInUser?._id === channel?._id && (
            <button
                onClick={() => navigate("/edit-profile")}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition"
            >
                Edit Profile
            </button>
        )}
    </div>
    {videos.length === 0 ? (

                
                        <p className="text-gray-400">No videos uploaded yet</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {videos.map((video) => (
                                <VideoCard key={video._id} video={video} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Channel