import { useNavigate } from "react-router-dom"

function VideoCard({ video }) {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(`/watch/${video._id}`)}
            className="cursor-pointer group"
        >
            <div className="relative rounded-lg overflow-hidden">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, "0")}
                </span>
            </div>
            <div className="mt-2 flex gap-2">
                <img
                    src={video.owner?.avatar}
                    alt={video.owner?.username}
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
                <div>
                    <h3 className="text-white font-semibold text-sm line-clamp-2">
                        {video.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">{video.owner?.fullName}</p>
                    <p className="text-gray-400 text-xs">{video.views} views</p>
                </div>
            </div>
        </div>
    )
}

export default VideoCard