import { Link } from "react-router-dom";

function ForbiddenPage() {
  return (
    <main className="page">
      <h1>접근 권한이 없음</h1>
      <Link to="/">홈으로</Link>
    </main>
  );
}

export default ForbiddenPage;
