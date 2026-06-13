function VideoCardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="w-full h-48 bg-gray-700 rounded-lg" />
            <div className="mt-2 flex gap-2">
                <div className="w-9 h-9 bg-gray-700 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2 mt-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-700 rounded w-1/2" />
                    <div className="h-3 bg-gray-700 rounded w-1/4" />
                </div>
            </div>
        </div>
    )
}

export default VideoCardSkeleton