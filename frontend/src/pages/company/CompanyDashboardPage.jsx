import { Link } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { getCompanyById } from "../../utils/companyStorage";
import { getCompanyDealersByCompanyId } from "../../utils/companyDealerStorage";
import { carDummyData } from "../../data/carDummyData";
import { getCompanyNoticesByCompanyId } from "../../utils/companyNoticeStorage";
import "../../css/company/companyDashboardPage.css";

function CompanyDashboardPage() {
  const company = getCompanyById(10);
  const dealers = getCompanyDealersByCompanyId(company.id);
  const cars = carDummyData.filter((car) => car.companyId === company.id);
  const recentNotices = getCompanyNoticesByCompanyId(company.id).slice(0, 3);

  return (
    <main className="page company-dashboard-page">
      <PageTitle
        title="기업 관리"
        description="회사 정보, 소속 딜러와 등록 매물을 관리하는 기업회원 전용 화면입니다."
      >
        <Link to={`/companies/${company.id}`} className="outline-btn">
          회사 공개 페이지 보기
        </Link>
      </PageTitle>

      <section className="company-dashboard-summary">
        <article><span>소속 딜러</span><strong>{dealers.length}명</strong><small>회사에서 생성한 딜러 계정</small></article>
        <article><span>판매 중 매물</span><strong>{cars.length}대</strong><small>소속 딜러 등록 매물</small></article>
        <article><span>누적 판매</span><strong>{company.salesCount}건</strong><small>기업 전체 판매 실적</small></article>
        <article><span>회사 평점</span><strong>{company.rating}</strong><small>거래 후기 기준</small></article>
      </section>

      <section className="company-dashboard-grid">
        <article className="company-manage-panel">
          <div className="company-manage-header">
            <div><h2>회사 정보</h2><p>공개 페이지에 표시되는 기업 정보입니다.</p></div>
            <Link to={`/companies/${company.id}/edit`} className="outline-btn">정보 수정</Link>
          </div>
          <dl className="company-info-list">
            <div><dt>회사명</dt><dd>{company.name}</dd></div>
            <div><dt>사업자번호</dt><dd>{company.businessNumber}</dd></div>
            <div><dt>주소</dt><dd>{company.address}</dd></div>
            <div><dt>연락처</dt><dd>{company.phone}</dd></div>
            <div><dt>운영 상태</dt><dd>{company.status}</dd></div>
          </dl>
        </article>

        <article className="company-manage-panel">
          <div className="company-manage-header">
            <div><h2>소속 딜러 관리</h2><p>기업이 딜러 계정을 생성하고 상태를 관리합니다.</p></div>
            <Link to="/company/dealers/create" className="primary-btn">딜러 계정 생성</Link>
          </div>
          <div className="company-dealer-manage-list">
            {dealers.map((dealer) => (
              <div key={dealer.id}>
                <img src={dealer.profileImageUrl} alt={dealer.name} />
                <div><strong>{dealer.name}</strong><span>{dealer.position}</span></div>
                <Link to={`/dealers/${dealer.id}`}>딜러 페이지</Link>
              </div>
            ))}
          </div>
          <div className="company-manage-footer">
            <Link to="/company/dealers" className="outline-btn">소속 딜러 전체 관리</Link>
          </div>
        </article>
      </section>

      <article className="company-manage-panel company-notice-dashboard-panel">
        <div className="company-manage-header">
          <div>
            <h2>회사 게시글 관리</h2>
            <p>최근 게시글을 확인하고 회사 공지와 소식을 관리합니다.</p>
          </div>
          <Link
            to={`/companies/${company.id}/notices`}
            className="primary-btn"
          >
            게시글 관리
          </Link>
        </div>

        <div className="company-dashboard-notice-list">
          {recentNotices.length > 0 ? (
            recentNotices.map((notice) => (
              <Link
                key={notice.id}
                to={`/companies/${company.id}/notices/${notice.id}`}
              >
                <span>{notice.category === "NOTICE" ? "공지" : "소식"}</span>
                <strong>{notice.title}</strong>
              </Link>
            ))
          ) : (
            <p>등록된 회사 게시글이 없습니다.</p>
          )}
        </div>
      </article>

      <section className="company-manage-panel">
        <div className="company-manage-header">
          <div><h2>회사 매물 현황</h2><p>소속 딜러가 등록한 매물을 한곳에서 확인합니다.</p></div>
          <Link to="/cars" className="outline-btn">전체 매물 보기</Link>
        </div>
        <div className="company-car-table-wrap">
          <table className="company-car-table">
            <thead><tr><th>차량</th><th>담당 딜러</th><th>가격</th><th>등록일</th><th>상태</th></tr></thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td><Link to={`/cars/${car.id}`}>{car.title}</Link></td>
                  <td>{car.dealerName}</td>
                  <td>{car.price.toLocaleString()}만원</td>
                  <td>{car.registeredDate}</td>
                  <td>{car.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default CompanyDashboardPage;
