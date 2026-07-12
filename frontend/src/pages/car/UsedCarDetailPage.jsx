import { Link, useParams } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { carDummyData } from "../../data/carDummyData";
import "../../css/car/usedCarDetailPage.css";

function UsedCarDetailPage() {
  const { carId } = useParams();
  const car = carDummyData.find((item) => item.id === Number(carId));

  if (!car) {
    return (
      <main className="page">
        <PageTitle
          title="차량을 찾을 수 없습니다."
          description="존재하지 않거나 삭제된 매물입니다."
        />
        <Link to="/cars" className="text-btn">
          목록으로 돌아가기
        </Link>
      </main>
    );
  }

  const messageUrl = `/messages/new?carId=${car.id}&receiverType=${car.sellerType}&receiverId=${car.sellerId}`;

  return (
    <main className="page used-car-detail-page">
      <PageTitle
        title={car.title}
        description="중고차 거래 상세 화면입니다."
      >
        <Link to="/cars" className="outline-btn">
          목록으로
        </Link>
      </PageTitle>

      <section className="car-detail-layout">
        <div className="car-detail-left">
          <div className="car-detail-image">
            <img src={car.imageUrl} alt={car.title} />
            <span className="car-detail-status">{car.status}</span>
          </div>

          <section className="detail-section">
            <h2>차량 설명</h2>
            <p>{car.description}</p>
          </section>
        </div>

        <aside className="car-detail-info">
          <div className="detail-price-box">
            <p className="detail-status-text">{car.status}</p>
            <strong>{car.price.toLocaleString()}만원</strong>
          </div>

          <section className="detail-section">
            <h2>차량 정보</h2>

            <div className="detail-info-grid">
              <div className="detail-info-item">
                <span>브랜드</span>
                <strong>{car.brand}</strong>
              </div>

              <div className="detail-info-item">
                <span>모델명</span>
                <strong>{car.model}</strong>
              </div>

              <div className="detail-info-item">
                <span>연식</span>
                <strong>{car.year}년식</strong>
              </div>

              <div className="detail-info-item">
                <span>주행거리</span>
                <strong>{car.mileage.toLocaleString()}km</strong>
              </div>

              <div className="detail-info-item">
                <span>지역</span>
                <strong>{car.region}</strong>
              </div>

              <div className="detail-info-item">
                <span>차량 종류</span>
                <strong>{car.carType}</strong>
              </div>

              <div className="detail-info-item">
                <span>연료</span>
                <strong>{car.fuelType}</strong>
              </div>

              <div className="detail-info-item">
                <span>변속기</span>
                <strong>{car.transmission}</strong>
              </div>

              <div className="detail-info-item">
                <span>외장 색상</span>
                <strong>{car.exteriorColor}</strong>
              </div>

              <div className="detail-info-item">
                <span>내장 색상</span>
                <strong>{car.interiorColor}</strong>
              </div>
            </div>
          </section>

          <section className="detail-section seller-section">
            <h2>판매자 정보</h2>

            <div className="seller-card">
              <div>
                <span className="seller-type">{car.sellerTypeName}</span>

                {car.sellerType === "DEALER" ? (
                  <Link
                    to={`/dealers/${car.dealerId}`}
                    className="seller-name-link"
                  >
                    {car.dealerName}
                  </Link>
                ) : (
                  <span className="seller-name-text">{car.sellerName}</span>
                )}
              </div>

              {car.sellerType === "DEALER" && (
                <div className="seller-company-row">
                  <span>소속 회사</span>
                  <Link
                    to={`/companies/${car.companyId}`}
                    className="company-name-link"
                  >
                    {car.companyName}
                  </Link>
                </div>
              )}

              <div className="seller-company-row">
                <span>등록일</span>
                <strong>{car.registeredDate}</strong>
              </div>
            </div>
          </section>

          <div className="detail-action-box">
            <Link to={messageUrl} className="primary-btn detail-main-btn">
              메세지로 문의하기
            </Link>

            <button type="button" className="outline-btn detail-main-btn">
              찜하기
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default UsedCarDetailPage;