// src/components/common/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isLogin } = useAuth();

  if (!isLogin) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;