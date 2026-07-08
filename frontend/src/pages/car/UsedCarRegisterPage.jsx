import PageTitle from "../../components/common/PageTitle";
import "../../css/car/usedCarRegisterPage.css";

function UsedCarRegisterPage() {
  return (
    <main className="page">
      <PageTitle title="차량 판매 등록" description="백엔드 연결 전 화면용 등록 폼입니다." />
      <form className="register-form">
        <label>차량 제목<input placeholder="예: 현대 아반떼 CN7 1.6" /></label>
        <label>브랜드<input placeholder="현대" /></label>
        <label>모델명<input placeholder="아반떼" /></label>
        <div className="form-grid-2">
          <label>연식<input type="number" placeholder="2022" /></label>
          <label>주행거리<input type="number" placeholder="28000" /></label>
        </div>
        <div className="form-grid-2">
          <label>판매가<input type="number" placeholder="1980" /></label>
          <label>지역<input placeholder="서울" /></label>
        </div>
        <label>차량 설명<textarea rows="7" placeholder="차량 상태, 사고 이력, 정비 내역 등을 입력" /></label>
        <label>차량 이미지<input type="file" multiple /></label>
        <button type="button" className="primary-btn">등록 테스트</button>
      </form>
    </main>
  );
}

export default UsedCarRegisterPage;
