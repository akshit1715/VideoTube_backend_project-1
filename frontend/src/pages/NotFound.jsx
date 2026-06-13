import { useNavigate } from "react-router-dom"

function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-4">
            <h1 className="text-8xl font-bold text-red-500">404</h1>
            <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
            <p className="text-gray-400 text-sm">The page you're looking for doesn't exist.</p>
            <button
                onClick={() => navigate("/")}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
            >
                Go Home
            </button>
        </div>
    )
}

export default NotFound