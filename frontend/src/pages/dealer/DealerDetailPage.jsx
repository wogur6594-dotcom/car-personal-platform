import { Link, useParams } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import CarCard from "../../components/car/CarCard";
import { dealerDummyData } from "../../data/dealerDummyData";
import { carDummyData } from "../../data/carDummyData";
import "../../css/dealer/dealerDetailPage.css";

function DealerDetailPage() {
  const { dealerId } = useParams();

  const dealer = dealerDummyData.find(
    (item) => item.id === Number(dealerId)
  );

  const dealerCars = carDummyData.filter(
    (car) => car.dealerId === Number(dealerId)
  );

  if (!dealer) {
    return (
      <main className="page dealer-detail-page">
        <PageTitle
          title="딜러를 찾을 수 없습니다."
          description="존재하지 않거나 삭제된 딜러 정보입니다."
        />

        <Link to="/cars" className="outline-btn">
          중고차 목록으로
        </Link>
      </main>
    );
  }

  const messageUrl = `/messages/new?receiverType=DEALER&receiverId=${dealer.id}`;

  return (
    <main className="page dealer-detail-page">
      <PageTitle
        title={`${dealer.name} 딜러`}
        description="딜러 공개 페이지입니다."
      >
        <Link to="/cars" className="outline-btn">
          중고차 목록으로
        </Link>
      </PageTitle>

      <section className="dealer-profile-section">
        <div className="dealer-profile-card">
          <div className="dealer-profile-image">
            <img src={dealer.profileImageUrl} alt={dealer.name} />
          </div>

          <div className="dealer-profile-info">
            <span className="dealer-badge">{dealer.responseStatus}</span>

            <h2>{dealer.name}</h2>

            <p className="dealer-position">{dealer.position}</p>

            <div className="dealer-company-row">
              <span>소속 회사</span>
              <Link to={`/companies/${dealer.companyId}`}>
                {dealer.companyName}
              </Link>
            </div>

            <p className="dealer-introduction">{dealer.introduction}</p>

            <div className="dealer-action-row">
              <Link to={messageUrl} className="primary-btn">
                메세지로 문의하기
              </Link>

              <Link
                to={`/companies/${dealer.companyId}`}
                className="outline-btn"
              >
                회사 페이지 보기
              </Link>
            </div>
          </div>
        </div>

        <div className="dealer-summary-card">
          <div>
            <span>활동 지역</span>
            <strong>{dealer.region}</strong>
          </div>

          <div>
            <span>경력</span>
            <strong>{dealer.career}</strong>
          </div>

          <div>
            <span>판매 건수</span>
            <strong>{dealer.salesCount}건</strong>
          </div>

          <div>
            <span>평점</span>
            <strong>{dealer.rating}</strong>
          </div>
        </div>
      </section>

      <section className="dealer-car-section">
        <div className="dealer-section-title">
          <div>
            <h2>판매 중인 차량</h2>
            <p>해당 딜러가 등록한 차량 목록입니다.</p>
          </div>

          <strong>총 {dealerCars.length}대</strong>
        </div>

        {dealerCars.length > 0 ? (
          <div className="dealer-car-list">
            {dealerCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="dealer-empty-box">
            현재 판매 중인 차량이 없습니다.
          </div>
        )}
      </section>
    </main>
  );
}

export default DealerDetailPage;