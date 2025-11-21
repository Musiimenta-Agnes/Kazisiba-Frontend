// components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = sessionStorage.getItem("adminToken");
    const location = useLocation(); // capture attempted URL

    if (!token) {
        // Redirect to login and remember where they wanted to go
        return <Navigate to="/kazisiba-admin/login" state={{ from: location }} replace />;
    }

  return children;
};

export default ProtectedRoute;
