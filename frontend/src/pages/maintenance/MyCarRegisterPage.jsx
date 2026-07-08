import PageTitle from "../../components/common/PageTitle";
import "../../css/maintenance/myCarRegisterPage.css";

function MyCarRegisterPage() {
  return (
    <main className="page">
      <PageTitle title="내 차량 등록" description="차량관리툴에서 사용할 차량 정보를 입력합니다." />
      <form className="register-form">
        <label>차량명<input placeholder="아반떼 CN7" /></label>
        <label>차량번호<input placeholder="12가 3456" /></label>
        <label>현재 주행거리<input type="number" placeholder="38500" /></label>
        <div className="form-grid-2">
          <label>마지막 엔진오일 교체 km<input type="number" placeholder="30000" /></label>
          <label>마지막 엔진오일 교체일<input type="date" /></label>
        </div>
        <div className="form-grid-2">
          <label>마지막 타이어 점검일<input type="date" /></label>
          <label>마지막 브레이크 점검일<input type="date" /></label>
        </div>
        <button type="button" className="primary-btn">등록 테스트</button>
      </form>
    </main>
  );
}

export default MyCarRegisterPage;
