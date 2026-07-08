import { Link } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import "../../css/member/myPage.css";

function MyPage() {
  return (
    <main className="page">
      <PageTitle title="마이페이지" description="개인프로젝트용 마이페이지입니다." />
      <section className="mypage-menu-grid">
        <Link to="/my-cars">내 판매 차량</Link>
        <Link to="/maintenance/register">내 차량 등록</Link>
        <Link to="/maintenance/history">정비 이력</Link>
        <Link to="/boards/write">게시글 작성</Link>
      </section>
    </main>
  );
}

export default MyPage;
