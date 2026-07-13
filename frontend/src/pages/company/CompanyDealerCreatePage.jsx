import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { companyDummyData } from "../../data/companyDummyData";
import { getLoginUser } from "../../utils/authStorage";
import { createCompanyDealer, getCompanyDealers } from "../../utils/companyDealerStorage";
import "../../css/company/companyDealerManagePage.css";

const POSITION_OPTIONS = ["사원", "주임", "대리", "과장", "차장", "부장", "팀장"];
const JOB_OPTIONS = ["중고차 판매", "매입 상담", "차량 진단", "고객 상담", "출고 관리"];
const REGION_OPTIONS = ["서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

const initialForm = {
  name: "",
  loginId: "",
  email: "",
  phone: "",
  employeeNumber: "",
  position: "사원",
  job: "중고차 판매",
  region: "서울",
  careerStartDate: new Date().toISOString().slice(0, 10),
  temporaryPassword: "1234",
  profileImageUrl: "/images/dealers/dealer1.jpg",
};

function CompanyDealerCreatePage() {
  const navigate = useNavigate();
  const loginUser = getLoginUser();
  const company = companyDummyData.find((item) => Number(item.id) === Number(loginUser?.companyId));
  const [form, setForm] = useState(initialForm);
  const [previewUrl, setPreviewUrl] = useState(initialForm.profileImageUrl);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => () => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMessage("이미지 파일만 등록할 수 있습니다.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("프로필 사진은 2MB 이하로 등록해주세요.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, profileImageUrl: reader.result }));
      setPreviewUrl(reader.result);
      setErrorMessage("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.loginId.trim() || !form.phone.trim()) {
      setErrorMessage("딜러명, 로그인 아이디, 연락처는 필수입니다.");
      return;
    }

    const duplicatedLoginId = getCompanyDealers().some(
      (dealer) => dealer.loginId.toLowerCase() === form.loginId.trim().toLowerCase()
    );
    if (duplicatedLoginId) {
      setErrorMessage("이미 사용 중인 로그인 아이디입니다.");
      return;
    }

    createCompanyDealer({
      ...form,
      name: form.name.trim(),
      loginId: form.loginId.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      employeeNumber: form.employeeNumber.trim() || `D-${Date.now().toString().slice(-4)}`,
      companyId: company.id,
      companyName: company.name,
      introduction: "",
    });

    navigate("/company/dealers", { replace: true, state: { message: "딜러 계정이 생성되었습니다." } });
  };

  return (
    <main className="page company-dealer-create-page">
      <PageTitle title="딜러 계정 생성" description="회사 소속으로 활동할 딜러의 기본 계정을 생성합니다." />

      <form className="company-dealer-create-form" onSubmit={handleSubmit}>
        <section className="company-dealer-form-section">
          <div className="company-dealer-form-header"><h2>소속 회사</h2><p>현재 로그인한 기업의 회사 정보가 자동 적용됩니다.</p></div>
          <div className="company-fixed-info"><span>회사명</span><strong>{company.name}</strong></div>
        </section>

        <section className="company-dealer-form-section">
          <div className="company-dealer-form-header"><h2>계정 정보</h2><p>딜러가 로그인할 때 사용하는 기본 정보입니다.</p></div>
          <div className="company-dealer-form-grid">
            <label><span>딜러명 *</span><input name="name" value={form.name} onChange={handleChange} /></label>
            <label><span>로그인 아이디 *</span><input name="loginId" value={form.loginId} onChange={handleChange} /></label>
            <label><span>임시 비밀번호</span><input name="temporaryPassword" value={form.temporaryPassword} onChange={handleChange} /></label>
            <label><span>사원번호</span><input name="employeeNumber" value={form.employeeNumber} onChange={handleChange} placeholder="미입력 시 자동 생성" /></label>
          </div>
        </section>

        <section className="company-dealer-form-section">
          <div className="company-dealer-form-header"><h2>딜러 정보</h2><p>회사에서 기본 인사정보, 경력 시작일과 프로필 사진을 등록합니다.</p></div>

          <div className="company-dealer-profile-upload">
            <img src={previewUrl} alt="프로필 미리보기" />
            <div><strong>프로필 사진</strong><p>JPG, PNG 등 이미지 파일을 2MB 이하로 등록해주세요.</p><label className="outline-btn">사진 선택<input type="file" accept="image/*" onChange={handleImageChange} hidden /></label></div>
          </div>

          <div className="company-dealer-form-grid">
            <label><span>이메일</span><input name="email" value={form.email} onChange={handleChange} /></label>
            <label><span>연락처 *</span><input name="phone" value={form.phone} onChange={handleChange} /></label>
            <label><span>직급</span><select name="position" value={form.position} onChange={handleChange}>{POSITION_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>담당 업무</span><select name="job" value={form.job} onChange={handleChange}>{JOB_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>활동 지역</span><select name="region" value={form.region} onChange={handleChange}>{REGION_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>경력 시작일</span><input name="careerStartDate" type="date" value={form.careerStartDate} max={new Date().toISOString().slice(0, 10)} onChange={handleChange} /></label>
          </div>
          <p className="company-dealer-intro-guide">소개문구는 딜러가 최초 로그인 후 자신의 프로필 관리 페이지에서 직접 작성합니다.</p>
        </section>

        {errorMessage && <p className="company-dealer-form-error">{errorMessage}</p>}
        <div className="company-dealer-form-actions"><button type="button" className="outline-btn" onClick={() => navigate(-1)}>취소</button><button type="submit" className="primary-btn">딜러 계정 생성</button></div>
      </form>
    </main>
  );
}

export default CompanyDealerCreatePage;
