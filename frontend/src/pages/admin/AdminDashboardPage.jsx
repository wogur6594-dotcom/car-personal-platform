import { Link } from "react-router-dom";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import {
  adminSummary,
  churnSummary,
  recentActivities,
  weeklyUsage,
} from "../../data/adminDummyData";

function AdminDashboardPage() {
  const maxVisits = Math.max(...weeklyUsage.map((item) => item.visits));

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="관리자 대시보드"
        description="사이트 운영 현황과 주요 위험 요소를 한눈에 확인합니다."
      />

      <div className="admin-summary-grid">
        <article className="admin-summary-card">
          <span>전체 회원</span>
          <strong>{adminSummary.totalMembers.toLocaleString()}명</strong>
          <small>오늘 +{adminSummary.newMembersToday}명</small>
        </article>
        <article className="admin-summary-card">
          <span>판매중 매물</span>
          <strong>{adminSummary.activeCars.toLocaleString()}건</strong>
          <small>검수 대기 {adminSummary.waitingCars}건</small>
        </article>
        <article className="admin-summary-card warning">
          <span>미처리 신고</span>
          <strong>{adminSummary.unreadReports}건</strong>
          <small>전체 신고 {adminSummary.reports}건</small>
        </article>
        <article className="admin-summary-card">
          <span>월간 방문</span>
          <strong>{adminSummary.monthlyVisits.toLocaleString()}회</strong>
          <small>전월 대비 +{adminSummary.visitChangeRate}%</small>
        </article>
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-panel admin-usage-panel">
          <div className="admin-panel-header">
            <div>
              <h2>최근 7일 방문량</h2>
              <p>일별 사이트 방문 횟수</p>
            </div>
            <Link to="/admin/statistics">상세보기</Link>
          </div>

          <div className="admin-bar-chart">
            {weeklyUsage.map((item) => (
              <div className="admin-bar-item" key={item.label}>
                <span className="admin-bar-value">{item.visits.toLocaleString()}</span>
                <div className="admin-bar-track">
                  <div
                    className="admin-bar-fill"
                    style={{ height: `${(item.visits / maxVisits) * 100}%` }}
                  />
                </div>
                <strong>{item.label}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>이탈위험 현황</h2>
              <p>모델 분석 결과 기준</p>
            </div>
            <Link to="/admin/churn">관리하기</Link>
          </div>

          <div className="admin-risk-list">
            <div><span>고위험 고객</span><strong>{churnSummary.highRisk}명</strong></div>
            <div><span>주의 고객</span><strong>{churnSummary.mediumRisk}명</strong></div>
            <div><span>관리 진행</span><strong>{churnSummary.managed}명</strong></div>
            <div><span>재활성 성공</span><strong>{churnSummary.recovered}명</strong></div>
          </div>
        </section>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2>최근 운영 활동</h2>
            <p>관리자가 확인해야 할 최근 변경사항입니다.</p>
          </div>
        </div>

        <div className="admin-activity-list">
          {recentActivities.map((activity) => (
            <div className="admin-activity-item" key={activity.id}>
              <span className="admin-activity-type">{activity.type}</span>
              <p>{activity.text}</p>
              <time>{activity.time}</time>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboardPage;
