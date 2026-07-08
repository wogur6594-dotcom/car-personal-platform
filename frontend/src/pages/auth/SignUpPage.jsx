// src/pages/auth/SignUpPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import "../../css/auth/signUpPage.css";

function SignUpPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    loginId: "",
    name: "",
    email: "",
    password: "",
    passwordCheck: "",
    role: "MEMBER",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSignUp = (event) => {
    event.preventDefault();

    if (!form.loginId.trim()) {
      setErrorMessage("아이디를 입력해주세요.");
      return;
    }

    if (!form.name.trim()) {
      setErrorMessage("이름을 입력해주세요.");
      return;
    }

    if (!form.email.trim()) {
      setErrorMessage("이메일을 입력해주세요.");
      return;
    }

    if (!form.password.trim()) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    if (form.password !== form.passwordCheck) {
      setErrorMessage("비밀번호 확인이 맞지 않습니다.");
      return;
    }

    alert("회원가입 테스트 완료");
    navigate("/login");
  };

  return (
    <main className="page auth-page">
      <PageTitle title="회원가입" description="일반회원 기준 회원가입 화면입니다." />

      <section className="auth-box">
        <form className="auth-form" onSubmit={handleSignUp}>
          <label>
            <span>회원유형</span>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="MEMBER">일반회원</option>
              <option value="DEALER">딜러회원</option>
            </select>
          </label>

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
            <span>이름</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="이름"
            />
          </label>

          <label>
            <span>이메일</span>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일"
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

          <label>
            <span>비밀번호 확인</span>
            <input
              name="passwordCheck"
              type="password"
              value={form.passwordCheck}
              onChange={handleChange}
              placeholder="비밀번호 확인"
            />
          </label>

          {errorMessage && <p className="auth-error-message">{errorMessage}</p>}

          <button type="submit" className="primary-btn">
            회원가입 테스트
          </button>
        </form>
      </section>
    </main>
  );
}

export default SignUpPage;