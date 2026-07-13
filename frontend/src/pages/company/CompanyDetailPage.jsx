import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import CarCard from "../../components/car/CarCard";
import { getCompanyById } from "../../utils/companyStorage";
import { dealerDummyData } from "../../data/dealerDummyData";
import { carDummyData } from "../../data/carDummyData";
import {
  COMPANY_NOTICE_CATEGORY_LABELS,
  getCompanyNoticesByCompanyId,
} from "../../utils/companyNoticeStorage";
import "../../css/company/companyDetailPage.css";

function CompanyDetailPage() {
  const { companyId } = useParams();

  const [company, setCompany] = useState(() =>
    getCompanyById(companyId)
  );

  useEffect(() => {
    const handleCompanyChange = () => {
      setCompany(getCompanyById(companyId));
    };

    window.addEventListener("companyChange", handleCompanyChange);

    return () => {
      window.removeEventListener("companyChange", handleCompanyChange);
    };
  }, [companyId]);

  const companyDealers = dealerDummyData.filter(
    (dealer) => dealer.companyId === Number(companyId)
  );

  const companyCars = carDummyData.filter(
    (car) => car.companyId === Number(companyId)
  );

  const recentNotices = getCompanyNoticesByCompanyId(companyId).slice(0, 4);

  if (!company) {
    return (
      <main className="page company-detail-page">
        <PageTitle
          title="회사를 찾을 수 없습니다."
          description="존재하지 않거나 삭제된 회사 정보입니다."
        />

        <Link to="/cars" className="outline-btn">
          중고차 목록으로
        </Link>
      </main>
    );
  }

  return (
    <main className="page company-detail-page">
      <PageTitle
        title={company.name}
        description="회사 공개 페이지입니다."
      >
        <Link to="/cars" className="outline-btn">
          중고차 목록으로
        </Link>
      </PageTitle>

      <section className="company-profile-section">
        <div className="company-profile-card">
          <div className="company-profile-image">
            <img src={company.profileImageUrl} alt={company.name} />
          </div>

          <div className="company-profile-info">
            <span className="company-badge">{company.status}</span>

            <h2>{company.name}</h2>

            <p className="company-introduction">{company.introduction}</p>

            <div className="company-info-grid">
              <div>
                <span>사업자번호</span>
                <strong>{company.businessNumber}</strong>
              </div>

              <div>
                <span>지역</span>
                <strong>{company.region}</strong>
              </div>

              <div>
                <span>주소</span>
                <strong>{company.address}</strong>
              </div>

              <div>
                <span>연락처</span>
                <strong>{company.phone}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="company-summary-card">
          <div>
            <span>평점</span>
            <strong>{company.rating}</strong>
          </div>

          <div>
            <span>소속 딜러</span>
            <strong>{company.dealerCount}명</strong>
          </div>

          <div>
            <span>판매 건수</span>
            <strong>{company.salesCount}건</strong>
          </div>
        </div>
      </section>

      <section className="company-notice-preview-section">
        <div className="company-section-title">
          <div>
            <h2>최근 게시글</h2>
            <p>회사의 공지사항과 새로운 소식을 확인할 수 있습니다.</p>
          </div>

          <Link
            to={`/companies/${company.id}/notices`}
            className="outline-btn"
          >
            게시글 전체보기
          </Link>
        </div>

        {recentNotices.length > 0 ? (
          <div className="company-notice-preview-list">
            {recentNotices.map((notice) => (
              <Link
                key={notice.id}
                to={`/companies/${company.id}/notices/${notice.id}`}
                className="company-notice-preview-item"
              >
                <div>
                  <span className={`company-notice-preview-badge ${notice.category.toLowerCase()}`}>
                    {COMPANY_NOTICE_CATEGORY_LABELS[notice.category]}
                  </span>
                  {notice.isPinned && (
                    <span className="company-notice-preview-pinned">중요</span>
                  )}
                </div>

                <strong>{notice.title}</strong>
                <time>
                  {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                </time>
              </Link>
            ))}
          </div>
        ) : (
          <div className="company-empty-box">
            등록된 회사 게시글이 없습니다.
          </div>
        )}
      </section>

      <section className="company-dealer-section">
        <div className="company-section-title">
          <div>
            <h2>소속 딜러</h2>
            <p>회사에 등록된 딜러 목록입니다.</p>
          </div>

          <strong>총 {companyDealers.length}명</strong>
        </div>

        {companyDealers.length > 0 ? (
          <div className="company-dealer-list">
            {companyDealers.map((dealer) => (
              <Link
                key={dealer.id}
                to={`/dealers/${dealer.id}`}
                className="company-dealer-card"
              >
                <div className="company-dealer-image">
                  <img src={dealer.profileImageUrl} alt={dealer.name} />
                </div>

                <div>
                  <h3>{dealer.name}</h3>
                  <p>{dealer.position}</p>

                  <div className="company-dealer-meta">
                    <span>{dealer.region}</span>
                    <span>판매 {dealer.salesCount}건</span>
                    <span>평점 {dealer.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="company-empty-box">
            등록된 딜러가 없습니다.
          </div>
        )}
      </section>

      <section className="company-car-section">
        <div className="company-section-title">
          <div>
            <h2>판매 중인 차량</h2>
            <p>해당 회사 소속 딜러가 등록한 차량 목록입니다.</p>
          </div>

          <strong>총 {companyCars.length}대</strong>
        </div>

        {companyCars.length > 0 ? (
          <div className="company-car-list">
            {companyCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="company-empty-box">
            현재 판매 중인 차량이 없습니다.
          </div>
        )}
      </section>
    </main>
  );
}

export default CompanyDetailPage;