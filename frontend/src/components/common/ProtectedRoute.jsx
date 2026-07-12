// src/components/common/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const { isLogin, loginUser } = useAuth();

  if (!isLogin) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (roles && roles.length > 0) {
    const userRole = loginUser?.role;

    if (!roles.includes(userRole)) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;