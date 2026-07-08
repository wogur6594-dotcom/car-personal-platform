import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "../../css/common/header.css";

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
          <Link className="logo" to="/">오토케어</Link>
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
              <span className="login-user-name">{loginUser.name}</span>
              <Link className="header-text-link" to="/mypage">마이페이지</Link>
              <button type="button" className="logout-btn" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <Link className="header-text-link" to="/signup">회원가입</Link>
              <Link className="login-btn" to="/login">로그인</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
