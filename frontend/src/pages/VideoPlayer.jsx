import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { getVideoById } from "../api/video.api.js"
import { getVideoComments, addComment, deleteComment } from "../api/comment.api.js"
import { toggleVideoLike, getLikedVideos } from "../api/like.api.js"
import Navbar from "../components/Navbar.jsx"
import api from "../api/axios.js"
import AddToPlaylist from "../components/AddToPlaylist.jsx"

function VideoPlayer() {
    const { videoId } = useParams()
    const navigate = useNavigate()
    const { user, isAuthenticated } = useSelector((state) => state.auth)
    const [video, setVideo] = useState(null)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const [liked, setLiked] = useState(false)
    const [disliked, setDisliked] = useState(false)
    const [subscribed, setSubscribed] = useState(false)
    const [shareMsg, setShareMsg] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

   useEffect(() => {
    const fetchData = async () => {
        try {
            const videoRes = await getVideoById(videoId)
            setVideo(videoRes.data.data)

            const commentsRes = await getVideoComments(videoId)
            setComments(commentsRes.data.data?.docs || [])

           
            if (isAuthenticated) {
                const likedRes = await getLikedVideos()
                const likedVideos = likedRes.data.data
                const isLiked = likedVideos.some(
                    (item) => String(item.video?._id) === String(videoId)
                )
                setLiked(isLiked)

                
                const subRes = await api.get(`/subscriptions/u/${user._id}`)
                console.log("subRes.data.data:", subRes.data.data)
                const subscribedChannels = subRes.data.data || []
                const isSubscribed = subscribedChannels.some(
                    sub => sub.channel?._id === videoRes.data.data?.owner?._id
                )
                setSubscribed(isSubscribed)

                await api.patch(`/users/watch-history/${videoId}`)
            }

        } catch (err) {
            console.error(err)
            setError("Failed to fetch video")
        } finally {
            setLoading(false)
        }
    }
    fetchData()
}, [videoId, isAuthenticated])

    const handleLike = async () => {
        if (!isAuthenticated) return
        try {
            await toggleVideoLike(videoId)
            if (disliked) setDisliked(false)
            setLiked(!liked)
        } catch (err) {
            console.error("Failed to toggle like", err)
        }
    }

    const handleDislike = () => {
        if (!isAuthenticated) return
        if (liked) setLiked(false)
        setDisliked(!disliked)
    }

    const handleSubscribe = async () => {
        if (!isAuthenticated) return
        try {
            await api.post(`/subscriptions/toggle/${video?.owner?._id}`)
            setSubscribed(!subscribed)
        } catch (err) {
            console.error("Failed to toggle subscription", err)
        }
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        setShareMsg("Link copied!")
        setTimeout(() => setShareMsg(""), 2000)
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return
        try {
            const res = await addComment(videoId, { content: newComment })
            setComments([res.data.data, ...comments])
            setNewComment("")
        } catch (err) {
            console.error("Failed to add comment", err)
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId)
            setComments(comments.filter(c => c._id !== commentId))
        } catch (err) {
            console.error("Failed to delete comment", err)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <p className="text-white text-center mt-20">Loading...</p>
        </div>
    )

    if (error) return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <p className="text-red-500 text-center mt-20">{error}</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Video Player */}
                <video
                    src={video?.videoFile}
                    controls
                    className="w-full rounded-lg bg-black"
                />

                {/* Video Info */}
                <div className="mt-4">
                    <h1 className="text-white text-2xl font-bold">{video?.title}</h1>
                    <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                        <p className="text-gray-400 text-sm">{video?.views} views</p>
                        <div className="flex items-center gap-2">
                            {/* Like */}
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-1 px-4 py-2 rounded-lg transition ${
                                    liked ? "bg-red-500 text-white" : "bg-gray-700 text-white hover:bg-gray-600"
                                }`}
                            >
                                👍 {liked ? "Liked" : "Like"}
                            </button>

                            {/* Dislike */}
                            <button
                                onClick={handleDislike}
                                className={`flex items-center gap-1 px-4 py-2 rounded-lg transition ${
                                    disliked ? "bg-gray-500 text-white" : "bg-gray-700 text-white hover:bg-gray-600"
                                }`}
                            >
                                👎
                            </button>

                            {/* Share */}
                            <div className="relative">
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
                                >
                                    🔗 Share
                                </button>
                                {shareMsg && (
                                    <span className="absolute -top-8 left-0 bg-gray-800 text-green-400 text-xs px-2 py-1 rounded whitespace-nowrap">
                                        {shareMsg}
                                    </span>
                                )}
                            </div>

                            {/* Save to Playlist */}
                            {isAuthenticated && <AddToPlaylist videoId={videoId} />}
                        </div>
                    </div>
                </div>

                {/* Owner Info + Subscribe */}
                <div className="flex items-center justify-between mt-4 pb-4 border-b border-gray-700">
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => navigate(`/channel/${video?.owner?.username}`)}
                    >
                        <img
                            src={video?.owner?.avatar}
                            alt={video?.owner?.username}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-white font-semibold">{video?.owner?.fullName}</p>
                            <p className="text-gray-400 text-sm">@{video?.owner?.username}</p>
                        </div>
                    </div>

                    {/* Subscribe button  */}
                    {isAuthenticated && user?._id !== video?.owner?._id && (
                        <button
                            onClick={handleSubscribe}
                            className={`px-5 py-2 rounded-full font-semibold text-sm transition ${
                                subscribed
                                    ? "bg-gray-700 text-white hover:bg-gray-600"
                                    : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                        >
                            {subscribed ? "Subscribed" : "Subscribe"}
                        </button>
                    )}
                </div>

                {/* Description */}
                <div className="mt-4 pb-4 border-b border-gray-700">
                    <p className="text-gray-300 text-sm">{video?.description}</p>
                </div>

                {/* Comments */}
                <div className="mt-6">
                    <h2 className="text-white text-xl font-semibold mb-4">
                        Comments ({comments.length})
                    </h2>

                    {isAuthenticated && (
                        <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
                            <img
                                src={user?.avatar}
                                alt={user?.username}
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="flex-1 bg-gray-700 text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Add a comment..."
                                />
                                <button
                                    type="submit"
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                                >
                                    Post
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-gray-400">No comments yet. Be the first to comment!</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment._id} className="flex gap-3">
                                    <img
                                        src={comment.owner?.avatar}
                                        alt={comment.owner?.username}
                                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-white text-sm font-semibold">
                                                @{comment.owner?.username}
                                            </p>
                                            {user?._id === comment.owner?._id && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className="text-red-500 text-xs hover:text-red-400"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer