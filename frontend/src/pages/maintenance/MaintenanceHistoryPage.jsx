import PageTitle from "../../components/common/PageTitle";
import "../../css/maintenance/maintenanceHistoryPage.css";

function MaintenanceHistoryPage() {
  return (
    <main className="page">
      <PageTitle title="정비 이력" description="나중에 정비소 리뷰, 정비 내역과 연결할 수 있는 화면입니다." />
      <div className="history-list">
        <div className="history-row"><strong>엔진오일 교체</strong><span>2026-01-10</span><span>30,000km</span></div>
        <div className="history-row"><strong>타이어 점검</strong><span>2025-12-20</span><span>27,500km</span></div>
      </div>
    </main>
  );
}

export default MaintenanceHistoryPage;
