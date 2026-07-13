import { useMemo, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatusBadge from "../../components/admin/AdminStatusBadge";
import { churnCustomers, companyChurnCustomers } from "../../data/adminDummyData";

function AdminChurnPage() {
  const [targetType, setTargetType] = useState("customer");
  const [customers, setCustomers] = useState(churnCustomers);
  const [companies, setCompanies] = useState(companyChurnCustomers);
  const [keyword, setKeyword] = useState("");
  const [level, setLevel] = useState("전체");

  const source = targetType === "customer" ? customers : companies;
  const filteredItems = useMemo(() => source.filter((item) => {
    const matchesKeyword = item.name.includes(keyword) || item.reason.includes(keyword);
    const matchesLevel = level === "전체" || item.level === level;
    return matchesKeyword && matchesLevel;
  }), [source, keyword, level]);

  const updateStatus = (id, status) => {
    const setter = targetType === "customer" ? setCustomers : setCompanies;
    setter((prev) => prev.map((item) => item.id === id ? { ...item, status } : item));
  };

  return (
    <div className="admin-page">
      <AdminPageHeader title="이탈위험 관리" description="일반 고객과 기업 고객의 활동 감소를 구분하여 관리합니다." />

      <div className="admin-info-box">
        기업 이탈점수는 최근 접속, 활성 매물 수, 딜러 활동률, 문의 응답률, 판매 전환율, 요금제·쿠폰 사용량을 조합해 계산하는 구조입니다.
      </div>

      <div className="admin-tab-menu">
        <button type="button" className={targetType === "customer" ? "active" : ""} onClick={() => setTargetType("customer")}>회원·딜러 이탈관리</button>
        <button type="button" className={targetType === "company" ? "active" : ""} onClick={() => setTargetType("company")}>기업 이탈관리</button>
      </div>

      <div className="admin-filter-bar">
        <input type="text" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder={`${targetType === "customer" ? "고객명" : "회사명"} 또는 위험 사유 검색`} />
        <select value={level} onChange={(event) => setLevel(event.target.value)}><option>전체</option><option>고위험</option><option>주의</option></select>
      </div>

      <section className="admin-panel admin-table-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              {targetType === "customer" ? (
                <tr><th>고객</th><th>유형</th><th>위험점수</th><th>위험도</th><th>마지막 접속</th><th>위험 사유</th><th>관리 상태</th><th>이탈방지 기능</th></tr>
              ) : (
                <tr><th>기업</th><th>위험점수</th><th>위험도</th><th>마지막 접속</th><th>딜러</th><th>활성 매물</th><th>위험 사유</th><th>관리 상태</th><th>이탈방지 기능</th></tr>
              )}
            </thead>
            <tbody>
              {filteredItems.map((item) => targetType === "customer" ? (
                <tr key={item.id}>
                  <td><strong>{item.name}</strong></td><td>{item.role}</td><td>{item.score}점</td><td><AdminStatusBadge value={item.level} /></td><td>{item.lastLogin}</td><td>{item.reason}</td><td><AdminStatusBadge value={item.status} /></td>
                  <td><div className="admin-row-actions"><button type="button" onClick={() => updateStatus(item.id, "쿠폰 지급")}>쿠폰</button><button type="button" onClick={() => updateStatus(item.id, "알림 발송")}>알림</button><button type="button" onClick={() => updateStatus(item.id, "상담 예정")}>상담</button></div></td>
                </tr>
              ) : (
                <tr key={item.id}>
                  <td><strong>{item.name}</strong></td><td>{item.score}점</td><td><AdminStatusBadge value={item.level} /></td><td>{item.lastLogin}</td><td>{item.dealerCount}명</td><td>{item.activeCars}건</td><td>{item.reason}</td><td><AdminStatusBadge value={item.status} /></td>
                  <td><div className="admin-row-actions"><button type="button" onClick={() => updateStatus(item.id, "프로모션 제공")}>프로모션</button><button type="button" onClick={() => updateStatus(item.id, "노출 강화")}>노출 강화</button><button type="button" onClick={() => updateStatus(item.id, "상담 예정")}>상담</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
export default AdminChurnPage;
