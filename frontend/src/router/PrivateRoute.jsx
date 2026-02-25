import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/auth.store'

export default function PrivateRoute() {
    const { isAuthenticated, loading } = useAuthStore()

    if (loading) return null

    return isAuthenticated ? <Outlet /> : <Navigate to="/setup" replace />
}
