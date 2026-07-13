import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { companyDummyData } from "../../data/companyDummyData";
import { AUTH_ROLES } from "../../utils/authRole";
import { getLoginUser } from "../../utils/authStorage";
import {
  COMPANY_NOTICE_CATEGORIES,
  createCompanyNotice,
} from "../../utils/companyNoticeStorage";
import "../../css/company/companyNoticePage.css";

function CompanyNoticeCreatePage() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const loginUser = getLoginUser();
  const numericCompanyId = Number(companyId);

  const company = companyDummyData.find(
    (item) => Number(item.id) === numericCompanyId
  );

  const isCompanyOwner =
    loginUser?.role === AUTH_ROLES.COMPANY &&
    Number(loginUser.companyId) === numericCompanyId;

  const [form, setForm] = useState({
    category: COMPANY_NOTICE_CATEGORIES.NOTICE,
    title: "",
    content: "",
    isPinned: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      window.alert("제목을 입력해주세요.");
      return;
    }

    if (!form.content.trim()) {
      window.alert("내용을 입력해주세요.");
      return;
    }

    const createdNotice = createCompanyNotice({
      ...form,
      companyId: numericCompanyId,
      writerId: loginUser.id,
      writerName: company.name,
    });

    navigate(
      `/companies/${numericCompanyId}/notices/${createdNotice.id}`,
      { replace: true }
    );
  };

  if (!company) {
    return <Navigate to="/not-found" replace />;
  }

  if (!isCompanyOwner) {
    return <Navigate to="/forbidden" replace />;
  }

  return (
    <main className="page company-notice-page">
      <PageTitle
        title="회사 게시글 작성"
        description={`${company.name} 공개 페이지에 표시할 게시글을 작성합니다.`}
      >
        <Link
          to={`/companies/${numericCompanyId}/notices`}
          className="outline-btn"
        >
          목록으로
        </Link>
      </PageTitle>

      <form className="company-notice-form-card" onSubmit={handleSubmit}>
        <div className="company-notice-form-row">
          <div className="company-notice-form-field">
            <label htmlFor="notice-category">분류</label>
            <select
              id="notice-category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value={COMPANY_NOTICE_CATEGORIES.NOTICE}>공지사항</option>
              <option value={COMPANY_NOTICE_CATEGORIES.NEWS}>회사 소식</option>
            </select>
          </div>

          <label className="company-notice-pin-check">
            <input
              type="checkbox"
              name="isPinned"
              checked={form.isPinned}
              onChange={handleChange}
            />
            <span>목록 상단에 중요 게시글로 고정</span>
          </label>
        </div>

        <div className="company-notice-form-field">
          <label htmlFor="notice-title">제목</label>
          <input
            id="notice-title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            maxLength={100}
            placeholder="게시글 제목을 입력해주세요."
          />
          <small>{form.title.length} / 100</small>
        </div>

        <div className="company-notice-form-field">
          <label htmlFor="notice-content">내용</label>
          <textarea
            id="notice-content"
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={14}
            placeholder="회사 공지 또는 소식 내용을 입력해주세요."
          />
        </div>

        <div className="company-notice-form-actions">
          <Link
            to={`/companies/${numericCompanyId}/notices`}
            className="outline-btn"
          >
            취소
          </Link>
          <button type="submit" className="primary-btn">
            게시글 등록
          </button>
        </div>
      </form>
    </main>
  );
}

export default CompanyNoticeCreatePage;
