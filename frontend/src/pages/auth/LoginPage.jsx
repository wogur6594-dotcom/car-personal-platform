import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { useAuth } from "../../hooks/useAuth";
import "../../css/auth/loginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    login({ id: 1, name: "정회원", role: "MEMBER" });
    navigate("/");
  };

  return (
    <main className="page auth-page">
      <PageTitle title="로그인" description="개인프로젝트용 임시 로그인입니다." />
      <section className="auth-box">
        <input placeholder="아이디" />
        <input type="password" placeholder="비밀번호" />
        <button type="button" className="primary-btn" onClick={handleLogin}>로그인 테스트</button>
      </section>
    </main>
  );
}

export default LoginPage;
