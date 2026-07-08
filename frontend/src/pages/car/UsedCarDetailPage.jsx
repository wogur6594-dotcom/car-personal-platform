import { Link, useParams } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { carDummyData } from "../../data/carDummyData";
import "../../css/car/usedCarDetailPage.css";

function UsedCarDetailPage() {
  const { id } = useParams();
  const car = carDummyData.find((item) => item.id === Number(id));

  if (!car) {
    return <main className="page"><PageTitle title="차량을 찾을 수 없습니다." /></main>;
  }

  return (
    <main className="page">
      <PageTitle title={car.title} description="일반 중고거래 상세 화면입니다." />
      <section className="car-detail-layout">
        <div className="car-detail-image"><img src={car.imageUrl} alt={car.title} /></div>
        <div className="car-detail-info">
          <strong className="detail-price">{car.price.toLocaleString()}만원</strong>
          <dl>
            <div><dt>연식</dt><dd>{car.year}년</dd></div>
            <div><dt>주행거리</dt><dd>{car.mileage.toLocaleString()}km</dd></div>
            <div><dt>지역</dt><dd>{car.region}</dd></div>
            <div><dt>연료</dt><dd>{car.fuel}</dd></div>
            <div><dt>변속기</dt><dd>{car.transmission}</dd></div>
            <div><dt>판매자</dt><dd>{car.sellerName}</dd></div>
          </dl>
          <p className="detail-description">{car.description}</p>
          <div className="detail-actions">
            <button type="button" className="primary-btn">문의하기</button>
            <button type="button" className="outline-btn">찜하기</button>
            <Link to="/cars" className="text-btn">목록으로</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default UsedCarDetailPage;
