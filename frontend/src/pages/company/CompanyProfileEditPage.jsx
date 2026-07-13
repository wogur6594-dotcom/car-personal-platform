import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { AUTH_ROLES } from "../../utils/authRole";
import { getLoginUser } from "../../utils/authStorage";
import { getCompanyById, updateCompany } from "../../utils/companyStorage";
import "../../css/company/companyProfileEditPage.css";

function CompanyProfileEditPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const loginUser = getLoginUser();
  const numericCompanyId = Number(companyId);
  const company = getCompanyById(numericCompanyId);

  const isCompanyOwner =
    loginUser?.role === AUTH_ROLES.COMPANY &&
    Number(loginUser.companyId) === numericCompanyId;

  const [formData, setFormData] = useState({
    region: "",
    address: "",
    phone: "",
    introduction: "",
    profileImageUrl: "",
  });

  useEffect(() => {
    if (!company) {
      return;
    }

    setFormData({
      region: company.region || "",
      address: company.address || "",
      phone: company.phone || "",
      introduction: company.introduction || "",
      profileImageUrl: company.profileImageUrl || "",
    });
  }, [company?.id]);

  if (!isCompanyOwner) {
    return <Navigate to="/forbidden" replace />;
  }

  if (!company) {
    return (
      <main className="page company-profile-edit-page">
        <PageTitle
          title="회사를 찾을 수 없습니다."
          description="존재하지 않거나 삭제된 회사입니다."
        />
      </main>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.region.trim()) {
      window.alert("지역을 입력해주세요.");
      return;
    }

    if (!formData.address.trim()) {
      window.alert("주소를 입력해주세요.");
      return;
    }

    if (!formData.phone.trim()) {
      window.alert("연락처를 입력해주세요.");
      return;
    }

    if (!formData.introduction.trim()) {
      window.alert("회사 소개를 입력해주세요.");
      return;
    }

    const updatedCompany = updateCompany(numericCompanyId, formData);

    if (!updatedCompany) {
      window.alert("회사 정보 수정에 실패했습니다.");
      return;
    }

    window.alert("회사 정보가 수정되었습니다.");
    navigate("/company/dashboard", { replace: true });
  };

  return (
    <main className="page company-profile-edit-page">
      <PageTitle
        title="회사 정보 수정"
        description="회사 공개 페이지에 표시되는 정보를 수정합니다."
      >
        <Link to="/company/dashboard" className="outline-btn">
          기업 관리로
        </Link>
      </PageTitle>

      <form className="company-profile-edit-card" onSubmit={handleSubmit}>
        <section className="company-profile-edit-section">
          <div className="company-profile-edit-heading">
            <h2>기본 정보</h2>
            <p>회사명과 사업자번호는 관리자 확인 후 변경할 수 있습니다.</p>
          </div>

          <div className="company-profile-edit-grid">
            <label>
              <span>회사명</span>
              <input type="text" value={company.name} disabled />
            </label>

            <label>
              <span>사업자번호</span>
              <input type="text" value={company.businessNumber} disabled />
            </label>

            <label>
              <span>지역</span>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                placeholder="예: 인천"
              />
            </label>

            <label>
              <span>연락처</span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="예: 032-123-4567"
              />
            </label>

            <label className="company-profile-edit-full">
              <span>주소</span>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="회사 주소를 입력해주세요."
              />
            </label>
          </div>
        </section>

        <section className="company-profile-edit-section">
          <div className="company-profile-edit-heading">
            <h2>공개 페이지 정보</h2>
            <p>회사 소개와 대표 이미지는 공개 페이지에 표시됩니다.</p>
          </div>

          <label className="company-profile-edit-field">
            <span>대표 이미지 URL</span>
            <input
              type="text"
              name="profileImageUrl"
              value={formData.profileImageUrl}
              onChange={handleChange}
              placeholder="/images/companies/company1.jpg"
            />
          </label>

          <label className="company-profile-edit-field">
            <span>회사 소개</span>
            <textarea
              name="introduction"
              value={formData.introduction}
              onChange={handleChange}
              rows="7"
              maxLength="500"
              placeholder="회사 소개를 입력해주세요."
            />
            <small>{formData.introduction.length}/500</small>
          </label>

          {formData.profileImageUrl && (
            <div className="company-profile-image-preview">
              <span>대표 이미지 미리보기</span>
              <img src={formData.profileImageUrl} alt="회사 대표 이미지 미리보기" />
            </div>
          )}
        </section>

        <div className="company-profile-edit-actions">
          <Link to="/company/dashboard" className="outline-btn">
            취소
          </Link>
          <button type="submit" className="primary-btn">
            수정 완료
          </button>
        </div>
      </form>
    </main>
  );
}

export default CompanyProfileEditPage;
