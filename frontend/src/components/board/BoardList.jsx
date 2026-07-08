import { Link } from "react-router-dom";
import "../../css/board/boardList.css";

function BoardList({ boards }) {
  return (
    <div className="board-list">
      {boards.map((board) => (
        <Link key={board.id} to={`/boards/${board.id}`} className="board-row">
          <span className="board-category">{board.categoryName}</span>
          <strong>{board.title}</strong>
          <span>{board.writer}</span>
          <span>{board.createdDate}</span>
          <span>조회 {board.hit}</span>
        </Link>
      ))}
    </div>
  );
}

export default BoardList;
