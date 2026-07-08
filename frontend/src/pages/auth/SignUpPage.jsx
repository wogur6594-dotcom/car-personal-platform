import PageTitle from "../../components/common/PageTitle";
import "../../css/auth/signUpPage.css";

function SignUpPage() {
  return (
    <main className="page auth-page">
      <PageTitle title="회원가입" description="일반회원 기준 회원가입 화면입니다." />
      <section className="auth-box">
        <input placeholder="아이디" />
        <input placeholder="이름" />
        <input placeholder="이메일" />
        <input type="password" placeholder="비밀번호" />
        <button type="button" className="primary-btn">회원가입 테스트</button>
      </section>
    </main>
  );
}

export default SignUpPage;
