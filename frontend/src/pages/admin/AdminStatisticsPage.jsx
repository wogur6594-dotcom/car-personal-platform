import AdminPageHeader from "../../components/admin/AdminPageHeader";
import {
  adminSummary,
  usageByFeature,
  weeklyUsage,
  monthlyMemberTrend,
  monthlyCarTrend,
} from "../../data/adminDummyData";

function LineChart({ data, series, valueFormatter = (value) => value.toLocaleString() }) {
  const width = 680;
  const height = 260;
  const padding = { top: 24, right: 24, bottom: 45, left: 58 };
  const values = data.flatMap((item) => series.map((line) => item[line.key]));
  const maxValue = Math.max(...values) * 1.1;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const x = (index) => padding.left + (chartWidth * index) / Math.max(data.length - 1, 1);
  const y = (value) => padding.top + chartHeight - (value / maxValue) * chartHeight;

  return (
    <div className="admin-svg-chart-wrap">
      <svg className="admin-svg-chart" viewBox={`0 0 ${width} ${height}`} role="img">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const value = maxValue * ratio;
          const lineY = y(value);
          return (
            <g key={ratio}>
              <line x1={padding.left} y1={lineY} x2={width - padding.right} y2={lineY} className="chart-grid-line" />
              <text x={padding.left - 10} y={lineY + 4} textAnchor="end" className="chart-axis-text">{valueFormatter(Math.round(value))}</text>
            </g>
          );
        })}
        {data.map((item, index) => (
          <text key={item.label} x={x(index)} y={height - 16} textAnchor="middle" className="chart-axis-text">{item.label}</text>
        ))}
        {series.map((line, seriesIndex) => {
          const points = data.map((item, index) => `${x(index)},${y(item[line.key])}`).join(" ");
          return (
            <g key={line.key} className={`chart-series chart-series-${seriesIndex + 1}`}>
              <polyline points={points} fill="none" />
              {data.map((item, index) => (
                <g key={`${line.key}-${item.label}`}>
                  <circle cx={x(index)} cy={y(item[line.key])} r="4" />
                  <title>{`${item.label} ${line.label}: ${valueFormatter(item[line.key])}`}</title>
                </g>
              ))}
            </g>
          );
        })}
      </svg>
      <div className="admin-chart-legend">
        {series.map((line, index) => <span key={line.key} className={`legend-${index + 1}`}>{line.label}</span>)}
      </div>
    </div>
  );
}

function AdminStatisticsPage() {
  const maxVisits = Math.max(...weeklyUsage.map((item) => item.visits));
  const maxFeatureCount = Math.max(...usageByFeature.map((item) => item.count));

  return (
    <div className="admin-page">
      <AdminPageHeader title="웹사이트 이용 통계" description="방문, 회원·기업 증가, 매물 거래와 기능별 사용량을 그래프로 확인합니다." />

      <div className="admin-summary-grid">
        <article className="admin-summary-card"><span>월간 방문</span><strong>{adminSummary.monthlyVisits.toLocaleString()}회</strong><small>전월 대비 +{adminSummary.visitChangeRate}%</small></article>
        <article className="admin-summary-card"><span>활성 매물</span><strong>{adminSummary.activeCars.toLocaleString()}건</strong><small>현재 판매중</small></article>
        <article className="admin-summary-card"><span>전체 회원</span><strong>{adminSummary.totalMembers.toLocaleString()}명</strong><small>오늘 +{adminSummary.newMembersToday}명</small></article>
        <article className="admin-summary-card"><span>입점 기업</span><strong>{adminSummary.totalCompanies}개</strong><small>기업회원 기준</small></article>
      </div>

      <div className="admin-statistics-grid">
        <section className="admin-panel">
          <div className="admin-panel-header"><div><h2>일별 방문량</h2><p>2026년 7월 6일 ~ 7월 12일</p></div></div>
          <div className="admin-bar-chart admin-date-bar-chart">
            {weeklyUsage.map((item) => (
              <div className="admin-bar-item" key={item.date}>
                <span className="admin-bar-value">{item.visits.toLocaleString()}</span>
                <div className="admin-bar-track"><div className="admin-bar-fill" style={{ height: `${(item.visits / maxVisits) * 100}%` }} /></div>
                <strong>{item.label}</strong><small>{item.date}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header"><div><h2>기능별 사용량</h2><p>2026년 7월 누적 사용 횟수와 비율</p></div></div>
          <div className="admin-feature-bars">
            {usageByFeature.map((item) => (
              <div className="admin-feature-bar-item" key={item.name}>
                <div><strong>{item.name}</strong><span>{item.count.toLocaleString()}회 · {item.value}%</span></div>
                <div className="admin-feature-bar-track"><span style={{ width: `${(item.count / maxFeatureCount) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel admin-chart-wide">
          <div className="admin-panel-header"><div><h2>회원·기업 증가 추이</h2><p>2026년 2월 ~ 7월 누적 계정 수</p></div></div>
          <LineChart data={monthlyMemberTrend} series={[{ key: "members", label: "회원" }, { key: "companies", label: "기업" }]} />
        </section>

        <section className="admin-panel admin-chart-wide">
          <div className="admin-panel-header"><div><h2>매물 등록·판매 추이</h2><p>2026년 2월 ~ 7월 월별 건수</p></div></div>
          <LineChart data={monthlyCarTrend} series={[{ key: "registered", label: "등록 매물" }, { key: "sold", label: "판매 완료" }]} />
        </section>
      </div>
    </div>
  );
}
export default AdminStatisticsPage;
