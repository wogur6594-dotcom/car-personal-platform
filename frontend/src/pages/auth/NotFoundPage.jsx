import { Link } from "react-router-dom";
import "../../css/auth/notFoundPage.css";

function NotFoundPage() {
  return (
    <main className="page not-found-page">
      <h1>404</h1>
      <p>페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="primary-btn">홈으로</Link>
    </main>
  );
}

export default NotFoundPage;
