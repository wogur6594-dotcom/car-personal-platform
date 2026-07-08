// src/pages/auth/LoginPage.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { useAuth } from "../../hooks/useAuth";
import "../../css/auth/loginPage.css";

const testAccounts = [
  {
    loginId: "member",
    password: "1234",
    token: "test-member-token",
    user: {
      id: 1,
      loginId: "member",
      name: "정회원",
      role: "MEMBER",
    },
  },
  {
    loginId: "dealer",
    password: "1234",
    token: "test-dealer-token",
    user: {
      id: 2,
      loginId: "dealer",
      name: "이딜러",
      role: "DEALER",
    },
  },
  {
    loginId: "admin",
    password: "1234",
    token: "test-admin-token",
    user: {
      id: 3,
      loginId: "admin",
      name: "관리자",
      role: "ADMIN",
    },
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    loginId: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const redirectPath = location.state?.from || "/";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (!form.loginId.trim()) {
      setErrorMessage("아이디를 입력해주세요.");
      return;
    }

    if (!form.password.trim()) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    const matchedAccount = testAccounts.find(
      (account) =>
        account.loginId === form.loginId && account.password === form.password
    );

    if (!matchedAccount) {
      setErrorMessage("아이디 또는 비밀번호가 맞지 않습니다.");
      return;
    }

    login({
      token: matchedAccount.token,
      user: matchedAccount.user,
    });

    navigate(redirectPath, { replace: true });
  };

  return (
    <main className="page auth-page">
      <PageTitle title="로그인" description="개인프로젝트용 임시 로그인입니다." />

      <section className="auth-box">
        <form className="auth-form" onSubmit={handleLogin}>
          <label>
            <span>아이디</span>
            <input
              name="loginId"
              value={form.loginId}
              onChange={handleChange}
              placeholder="아이디"
            />
          </label>

          <label>
            <span>비밀번호</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호"
            />
          </label>

          {errorMessage && <p className="auth-error-message">{errorMessage}</p>}

          <button type="submit" className="primary-btn">
            로그인
          </button>
        </form>

        <div className="test-account-box">
          <strong>테스트 계정</strong>
          <p>일반회원: member / 1234</p>
          <p>딜러회원: dealer / 1234</p>
          <p>관리자: admin / 1234</p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;