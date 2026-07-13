import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "../../css/common/header.css";
import MessageDropdown from "../message/MessageDropdown";

const menus = [
  { id: 1, name: "중고차거래", path: "/cars" },
  { id: 2, name: "주유소/정비소", path: "/repair-shops" },
  { id: 3, name: "차량관리", path: "/maintenance" },
  { id: 4, name: "커뮤니티", path: "/boards" },
];

function Header() {
  const navigate = useNavigate();
  const { isLogin, loginUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <Link className="logo" to="/">
            오토케어
          </Link>

          <nav className="nav">
            {menus.map((menu) => (
              <NavLink
                key={menu.id}
                to={menu.path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {menu.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="header-right">
          {isLogin ? (
            <>
              <div className="header-user-menu">
                <Link className="header-icon-link" to="/coupons">
                  쿠폰함
                  <span className="header-badge">2</span>
                </Link>

                <MessageDropdown />

                <Link className="header-icon-link" to="/notifications">
                  알림
                  <span className="header-badge">5</span>
                </Link>
              </div>

              <span className="login-user-name">{loginUser.name}</span>
              {loginUser.role === "ADMIN" && (
                <Link className="header-text-link" to="/admin">
                  관리자
                </Link>
              )}
              {loginUser.role === "COMPANY" && (
                <Link className="header-text-link" to="/company/dashboard">
                  기업 관리
                </Link>
              )}
              {loginUser.role === "DEALER" && (
                <Link className="header-text-link" to="/dealer/profile">
                  딜러 프로필
                </Link>
              )}
              {loginUser.role === "MEMBER" && (
                <Link className="header-text-link" to="/mypage">
                  마이페이지
                </Link>
              )}
              <button type="button" className="logout-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link className="header-icon-link" to="/coupons">
                쿠폰함
              </Link>

              <Link className="header-icon-link" to="/messages">
                메세지함
              </Link>

              <Link className="header-icon-link" to="/notifications">
                알림
              </Link>

              <Link className="header-text-link" to="/signup">
                회원가입
              </Link>

              <Link className="login-btn" to="/login">
                로그인
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;