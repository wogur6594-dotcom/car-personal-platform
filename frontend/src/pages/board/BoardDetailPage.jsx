import { Link, useParams } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { boardDummyData } from "../../data/boardDummyData";
import "../../css/board/boardDetailPage.css";

function BoardDetailPage() {
  const { id } = useParams();
  const board = boardDummyData.find((item) => item.id === Number(id));

  if (!board) return <main className="page"><PageTitle title="게시글을 찾을 수 없습니다." /></main>;

  return (
    <main className="page">
      <PageTitle title={board.title} description={`${board.categoryName} · ${board.writer} · ${board.createdDate}`} />
      <article className="board-detail-box">
        <p>{board.content}</p>
      </article>
      <section className="comment-box">
        <h2>댓글</h2>
        <div className="comment-item"><strong>정회원</strong><p>댓글 더미데이터입니다.</p></div>
        <textarea rows="4" placeholder="댓글 작성" />
        <button type="button" className="primary-btn">댓글 등록</button>
      </section>
      <Link to="/boards" className="text-btn">목록으로</Link>
    </main>
  );
}

export default BoardDetailPage;
