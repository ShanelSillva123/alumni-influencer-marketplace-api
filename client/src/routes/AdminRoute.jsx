import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== "ADMIN") {
        return (
            <div className="auth-error">
                Access denied. This page is restricted to administrators only.
            </div>
        );
    }

    return children;
}

export default AdminRoute;