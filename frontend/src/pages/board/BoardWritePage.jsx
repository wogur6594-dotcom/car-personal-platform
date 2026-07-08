import PageTitle from "../../components/common/PageTitle";
import "../../css/board/boardWritePage.css";

function BoardWritePage() {
  return (
    <main className="page">
      <PageTitle title="게시글 작성" description="커뮤니티 게시글 작성 화면입니다." />
      <form className="register-form">
        <label>게시판 선택
          <select>
            <option>일반게시판</option>
            <option>차량관리팁</option>
            <option>질문게시판</option>
          </select>
        </label>
        <label>제목<input placeholder="제목 입력" /></label>
        <label>내용<textarea rows="10" placeholder="내용 입력" /></label>
        <button type="button" className="primary-btn">등록 테스트</button>
      </form>
    </main>
  );
}

export default BoardWritePage;
