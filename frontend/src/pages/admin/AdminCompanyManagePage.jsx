import { useMemo, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatusBadge from "../../components/admin/AdminStatusBadge";
import { adminCompanies } from "../../data/adminDummyData";

function AdminCompanyManagePage() {
  const [companies, setCompanies] = useState(adminCompanies);
  const [keyword, setKeyword] = useState("");

  const filteredCompanies = useMemo(() => companies.filter((company) =>
    company.name.includes(keyword) || company.businessNumber.includes(keyword)
  ), [companies, keyword]);

  const toggleStatus = (id) => {
    setCompanies((prev) => prev.map((company) => company.id === id
      ? { ...company, status: company.status === "이용정지" ? "정상" : "이용정지" }
      : company
    ));
  };

  return (
    <div className="admin-page">
      <AdminPageHeader title="기업 관리" description="입점 기업, 사업자 인증과 기업 서비스 상태를 관리합니다." />
      <div className="admin-filter-bar">
        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="회사명 또는 사업자번호 검색" />
      </div>
      <section className="admin-panel admin-table-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>회사명</th><th>사업자번호</th><th>소속 딜러</th><th>활성 매물</th><th>가입일</th><th>상태</th><th>관리</th></tr></thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id}>
                  <td><strong>{company.name}</strong></td><td>{company.businessNumber}</td><td>{company.dealerCount}명</td><td>{company.activeCars}건</td><td>{company.joinedAt}</td>
                  <td><AdminStatusBadge value={company.status} /></td>
                  <td><button className="admin-outline-button" type="button" onClick={() => toggleStatus(company.id)}>{company.status === "이용정지" ? "정지 해제" : "이용 정지"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
export default AdminCompanyManagePage;
