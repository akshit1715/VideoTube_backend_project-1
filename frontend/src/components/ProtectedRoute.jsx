import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useSelector((state) => state.auth)

    if(loading){
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white">Loading...</p>
            </div>
        )
    }

    if(!isAuthenticated){
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute