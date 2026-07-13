import { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatusBadge from "../../components/admin/AdminStatusBadge";
import { adminReports } from "../../data/adminDummyData";

function AdminReportManagePage() {
  const [reports, setReports] = useState(adminReports);
  const updateStatus = (id, status) => setReports((prev) => prev.map((report) => report.id === id ? { ...report, status } : report));

  return (
    <div className="admin-page">
      <AdminPageHeader title="신고 관리" description="매물, 채팅, 게시글 신고 내역을 확인하고 처리합니다." />
      <section className="admin-panel admin-table-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>번호</th><th>신고 대상</th><th>신고자</th><th>신고 사유</th><th>접수일</th><th>상태</th><th>관리</th></tr></thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td><td><strong>{report.target}</strong></td><td>{report.reporter}</td><td>{report.reason}</td><td>{report.createdAt}</td><td><AdminStatusBadge value={report.status} /></td>
                  <td><div className="admin-row-actions"><button onClick={() => updateStatus(report.id, "처리중")}>처리 시작</button><button onClick={() => updateStatus(report.id, "완료")}>완료</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminReportManagePage;
