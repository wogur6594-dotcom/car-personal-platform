import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AUTH_ROLES } from "../../utils/authRole";
import { getCompanyDealerById } from "../../utils/companyDealerStorage";

function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const { isLogin, loginUser, logout } = useAuth();

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

  if (loginUser?.role === AUTH_ROLES.DEALER) {
    const dealer = getCompanyDealerById(loginUser.id);

    if (dealer && dealer.status !== "ACTIVE") {
      logout();

      return (
        <Navigate
          to="/login"
          replace
          state={{
            statusMessage:
              dealer.status === "RESIGNED"
                ? "퇴사 처리된 딜러 계정입니다."
                : "이용 정지된 딜러 계정입니다.",
          }}
        />
      );
    }
  }

  return children;
}

export default ProtectedRoute;