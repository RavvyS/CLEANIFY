import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can replace this with a loading spinner component
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // User's role is not authorized, redirect to their dashboard
    const roleDashboards = {
      admin: '/admin/dashboard',
      dispatcher: '/dispatcher/dashboard',
      collector: '/collector/dashboard',
      householder: '/householder/dashboard'
    };
    return <Navigate to={roleDashboards[user.role]} replace />;
  }

  return children;
};

export default ProtectedRoute;
