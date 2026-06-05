import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import Navbar from "../components/Navbar.jsx"
import VideoCard from "../components/VideoCard.jsx"
import api from "../api/axios.js"

function Channel() {
    const { username } = useParams()
    const { user: loggedInUser } = useSelector((state) => state.auth)
    const [channel, setChannel] = useState(null)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        const fetchChannel = async () => {
            try {
                const res = await api.get(`/users/c/${username}`)
                setChannel(res.data.message)
                setSubscribed(res.data.message.isSubscribed)

                const videosRes = await api.get(`/videos?userId=${res.data.message._id}`)
                setVideos(videosRes.data.message.docs)
            } catch (err) {
                console.error("Failed to fetch channel", err)
            } finally {
                setLoading(false)
            }
        }
        fetchChannel()
    }, [username])

    const handleSubscribe = async () => {
        try {
            await api.post(`/subscriptions/c/${channel._id}`)
            setSubscribed(!subscribed)
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
                    {loggedInUser?._id !== channel?._id && (
                        <button
                            onClick={handleSubscribe}
                            className={`mb-2 px-6 py-2 rounded-full font-semibold transition ${
                                subscribed
                                    ? "bg-gray-600 text-white hover:bg-gray-500"
                                    : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                        >
                            {subscribed ? "Subscribed" : "Subscribe"}
                        </button>
                    )}
                </div>

                {/* Videos */}
                <div className="mt-8">
                    <h2 className="text-white text-xl font-semibold mb-4">Videos</h2>
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