import { NavLink, Outlet } from "react-router-dom";
import "../../css/admin/admin.css";

const adminMenus = [
  { path: "/admin", label: "대시보드", end: true },
  { path: "/admin/churn", label: "이탈위험 관리" },
  { path: "/admin/members", label: "회원 관리" },
  { path: "/admin/companies", label: "기업 관리" },
  { path: "/admin/cars", label: "매물 관리" },
  { path: "/admin/reports", label: "신고 관리" },
  { path: "/admin/statistics", label: "이용 통계" },
];

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">
          <strong>관리자 페이지</strong>
          <span>AutoCare Admin</span>
        </div>

        <nav className="admin-menu">
          {adminMenus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              end={menu.end}
              className={({ isActive }) =>
                `admin-menu-link${isActive ? " active" : ""}`
              }
            >
              {menu.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}

export default AdminLayout;
