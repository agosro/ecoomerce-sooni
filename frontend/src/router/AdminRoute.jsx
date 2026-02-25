import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/auth.store'

export default function AdminRoute() {
    const { isAuthenticated, isAdminOrViewer, loading } = useAuthStore()

    if (loading) return null

    if (!isAuthenticated) return <Navigate to="/setup" replace />
    if (!isAdminOrViewer) return <Navigate to="/" replace />

    return <Outlet />
}
