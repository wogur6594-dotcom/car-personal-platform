import { useParams } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { placeDummyData } from "../../data/placeDummyData";
import "../../css/map/repairShopDetailPage.css";

function RepairShopDetailPage() {
  const { id } = useParams();
  const place = placeDummyData.find((item) => item.id === Number(id));

  if (!place) return <main className="page"><PageTitle title="정비소를 찾을 수 없습니다." /></main>;

  return (
    <main className="page">
      <PageTitle title={place.name} description={place.address} />
      <section className="repair-detail-box">
        <p>{place.description}</p>
        <div className="review-summary">평점 {place.rating} · 리뷰 {place.reviewCount}</div>
      </section>
      <section className="review-box">
        <h2>정비소 리뷰</h2>
        <div className="review-item"><strong>정회원</strong><p>엔진오일 교체가 빠르고 설명도 괜찮았습니다.</p></div>
        <div className="review-item"><strong>초보운전자</strong><p>예약하고 방문하니 오래 기다리지 않았습니다.</p></div>
        <textarea placeholder="리뷰 작성" rows="5" />
        <button type="button" className="primary-btn">리뷰 등록</button>
      </section>
    </main>
  );
}

export default RepairShopDetailPage;
