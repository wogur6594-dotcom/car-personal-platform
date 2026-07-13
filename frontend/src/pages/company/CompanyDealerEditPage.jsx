import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { AUTH_ROLES } from "../../utils/authRole";
import { getLoginUser } from "../../utils/authStorage";
import {
  getCompanyDealerById,
  updateCompanyDealerProfile,
} from "../../utils/companyDealerStorage";
import "../../css/company/companyDealerManagePage.css";

const POSITION_OPTIONS = [
  "사원",
  "주임",
  "대리",
  "과장",
  "팀장",
];

const JOB_OPTIONS = [
  "중고차 판매",
  "차량 상담",
  "매입 상담",
  "차량 점검",
  "고객 관리",
];

const REGION_OPTIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "대전",
  "광주",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

function CompanyDealerEditPage() {
  const { dealerId } = useParams();
  const navigate = useNavigate();
  const loginUser = getLoginUser();

  const dealer = getCompanyDealerById(dealerId);

  const isCompanyOwner =
    loginUser?.role === AUTH_ROLES.COMPANY &&
    dealer &&
    Number(loginUser.companyId) === Number(dealer.companyId);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    employeeNumber: "",
    position: "",
    job: "",
    region: "",
    careerStartDate: "",
    profileImageUrl: "",
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!dealer) {
      return;
    }

    setForm({
      name: dealer.name || "",
      email: dealer.email || "",
      phone: dealer.phone || "",
      employeeNumber: dealer.employeeNumber || "",
      position: dealer.position || "사원",
      job: dealer.job || "중고차 판매",
      region: dealer.region || "서울",
      careerStartDate: dealer.careerStartDate || "",
      profileImageUrl:
        dealer.profileImageUrl || "/images/dealers/dealer1.jpg",
    });

    setPreviewUrl(
      dealer.profileImageUrl || "/images/dealers/dealer1.jpg"
    );
  }, [dealer?.id]);

  if (!dealer) {
    return (
      <main className="page company-dealer-create-page">
        <PageTitle
          title="딜러를 찾을 수 없습니다."
          description="존재하지 않거나 삭제된 딜러입니다."
        />
      </main>
    );
  }

  if (!isCompanyOwner) {
    return <Navigate to="/forbidden" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("이미지 파일만 등록할 수 있습니다.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("이미지는 2MB 이하로 등록해주세요.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageUrl = reader.result;

      setPreviewUrl(imageUrl);

      setForm((prev) => ({
        ...prev,
        profileImageUrl: imageUrl,
      }));

      setErrorMessage("");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setErrorMessage("딜러명을 입력해주세요.");
      return;
    }

    if (!form.phone.trim()) {
      setErrorMessage("연락처를 입력해주세요.");
      return;
    }

    if (!form.employeeNumber.trim()) {
      setErrorMessage("사원번호를 입력해주세요.");
      return;
    }

    const updatedDealer = updateCompanyDealerProfile(
      dealer.id,
      {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        employeeNumber: form.employeeNumber.trim(),
      }
    );

    if (!updatedDealer) {
      setErrorMessage("딜러 정보 수정에 실패했습니다.");
      return;
    }

    navigate("/company/dealers", {
      replace: true,
      state: {
        message: "딜러 정보가 수정되었습니다.",
      },
    });
  };

  return (
    <main className="page company-dealer-create-page">
      <PageTitle
        title="딜러 정보 수정"
        description="회사에서 관리하는 딜러의 기본 정보를 수정합니다."
      >
        <Link
          to="/company/dealers"
          className="outline-btn"
        >
          딜러 관리로
        </Link>
      </PageTitle>

      <form
        className="company-dealer-create-form"
        onSubmit={handleSubmit}
      >
        <section className="company-dealer-form-section">
          <div className="company-dealer-form-header">
            <h2>계정 정보</h2>
            <p>
              로그인 아이디는 계정 식별 정보이므로
              변경할 수 없습니다.
            </p>
          </div>

          <div className="company-dealer-form-grid">
            <label>
              <span>로그인 아이디</span>

              <input
                value={dealer.loginId}
                disabled
              />
            </label>

            <label>
              <span>사원번호 *</span>

              <input
                name="employeeNumber"
                value={form.employeeNumber}
                onChange={handleChange}
              />
            </label>
          </div>
        </section>

        <section className="company-dealer-form-section">
          <div className="company-dealer-form-header">
            <h2>딜러 정보</h2>

            <p>
              딜러 공개 페이지에 표시되는 기본 정보를
              수정합니다.
            </p>
          </div>

          <div className="company-dealer-profile-upload">
            <img
              src={previewUrl}
              alt="딜러 프로필 미리보기"
            />

            <div>
              <strong>프로필 사진</strong>

              <p>
                JPG, PNG 등의 이미지 파일을
                2MB 이하로 등록해주세요.
              </p>

              <label className="outline-btn">
                사진 선택

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </label>
            </div>
          </div>

          <div className="company-dealer-form-grid">
            <label>
              <span>딜러명 *</span>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>연락처 *</span>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>이메일</span>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>직급</span>

              <select
                name="position"
                value={form.position}
                onChange={handleChange}
              >
                {POSITION_OPTIONS.map((position) => (
                  <option
                    key={position}
                    value={position}
                  >
                    {position}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>담당 업무</span>

              <select
                name="job"
                value={form.job}
                onChange={handleChange}
              >
                {JOB_OPTIONS.map((job) => (
                  <option
                    key={job}
                    value={job}
                  >
                    {job}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>활동 지역</span>

              <select
                name="region"
                value={form.region}
                onChange={handleChange}
              >
                {REGION_OPTIONS.map((region) => (
                  <option
                    key={region}
                    value={region}
                  >
                    {region}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>경력 시작일</span>

              <input
                type="date"
                name="careerStartDate"
                value={form.careerStartDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={handleChange}
              />
            </label>
          </div>
        </section>

        {errorMessage && (
          <p className="company-dealer-form-error">
            {errorMessage}
          </p>
        )}

        <div className="company-dealer-form-actions">
          <button
            type="button"
            className="outline-btn"
            onClick={() => navigate(-1)}
          >
            취소
          </button>

          <button
            type="submit"
            className="primary-btn"
          >
            수정 완료
          </button>
        </div>
      </form>
    </main>
  );
}

export default CompanyDealerEditPage;