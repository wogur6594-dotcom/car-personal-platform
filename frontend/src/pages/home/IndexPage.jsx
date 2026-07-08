import { Link } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import CarCard from "../../components/car/CarCard";
import { carDummyData } from "../../data/carDummyData";
import "../../css/home/indexPage.css";

function IndexPage() {
  return (
    <main className="page index-page">
      <section className="hero-section">
        <div>
          <span className="hero-label">개인프로젝트 버전</span>
          <h1>중고차 거래부터 차량관리까지 한 곳에서</h1>
          <p>경매 기능은 제외하고 일반 중고거래, 카카오맵 기반 정비소/주유소, 차량관리 알림, 커뮤니티 중심으로 구성했습니다.</p>
          <div className="hero-actions">
            <Link to="/cars" className="primary-btn">중고차 보기</Link>
            <Link to="/maintenance" className="outline-btn">차량관리툴</Link>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <Link to="/cars" className="feature-card"><strong>중고차거래</strong><p>일반 판매글 중심으로 구성</p></Link>
        <Link to="/repair-shops" className="feature-card"><strong>정비소/주유소</strong><p>카카오맵 API 연결 예정</p></Link>
        <Link to="/maintenance" className="feature-card"><strong>차량관리툴</strong><p>주행거리와 점검일 기준 알림</p></Link>
        <Link to="/boards" className="feature-card"><strong>커뮤니티</strong><p>일반, 팁, 질문 게시판</p></Link>
      </section>

      <PageTitle title="최근 등록 차량" description="개인프로젝트용 더미데이터입니다." />
      <section className="home-car-list">
        {carDummyData.map((car) => <CarCard key={car.id} car={car} />)}
      </section>
    </main>
  );
}

export default IndexPage;
