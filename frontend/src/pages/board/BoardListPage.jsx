import { Link, useSearchParams } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import BoardList from "../../components/board/BoardList";
import { boardDummyData } from "../../data/boardDummyData";
import "../../css/board/boardPage.css";

function BoardListPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";

  const boards = category === "all" ? boardDummyData : boardDummyData.filter((board) => board.category === category);

  return (
    <main className="page">
      <PageTitle title="커뮤니티" description="일반게시판, 차량관리팁, 질문게시판으로 나눠서 구성했습니다.">
        <Link to="/boards/write" className="primary-btn">글쓰기</Link>
      </PageTitle>
      <div className="board-tabs">
        <Link to="/boards">전체</Link>
        <Link to="/boards?category=free">일반게시판</Link>
        <Link to="/boards?category=tips">차량관리팁</Link>
        <Link to="/boards?category=questions">질문게시판</Link>
      </div>
      <BoardList boards={boards} />
    </main>
  );
}

export default BoardListPage;
