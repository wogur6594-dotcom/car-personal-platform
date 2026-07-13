import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { companyDummyData } from "../../data/companyDummyData";
import { AUTH_ROLES } from "../../utils/authRole";
import { getLoginUser } from "../../utils/authStorage";
import {
  COMPANY_NOTICE_CATEGORIES,
  getCompanyNoticeById,
  updateCompanyNotice,
} from "../../utils/companyNoticeStorage";
import "../../css/company/companyNoticePage.css";

function CompanyNoticeEditPage() {
  const { companyId, noticeId } = useParams();
  const navigate = useNavigate();
  const loginUser = getLoginUser();
  const numericCompanyId = Number(companyId);
  const numericNoticeId = Number(noticeId);

  const company = companyDummyData.find(
    (item) => Number(item.id) === numericCompanyId
  );
  const notice = getCompanyNoticeById(numericNoticeId);

  const isValidNotice =
    notice && Number(notice.companyId) === numericCompanyId;

  const isCompanyOwner =
    loginUser?.role === AUTH_ROLES.COMPANY &&
    Number(loginUser.companyId) === numericCompanyId;

  const [form, setForm] = useState(() => ({
    category: notice?.category || COMPANY_NOTICE_CATEGORIES.NOTICE,
    title: notice?.title || "",
    content: notice?.content || "",
    isPinned: Boolean(notice?.isPinned),
  }));

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

    const updatedNotice = updateCompanyNotice(numericNoticeId, form);

    if (!updatedNotice) {
      window.alert("게시글 수정에 실패했습니다.");
      return;
    }

    navigate(
      `/companies/${numericCompanyId}/notices/${numericNoticeId}`,
      { replace: true }
    );
  };

  if (!company || !isValidNotice) {
    return <Navigate to="/not-found" replace />;
  }

  if (!isCompanyOwner) {
    return <Navigate to="/forbidden" replace />;
  }

  return (
    <main className="page company-notice-page">
      <PageTitle
        title="회사 게시글 수정"
        description={`${company.name} 게시글 내용을 수정합니다.`}
      >
        <Link
          to={`/companies/${numericCompanyId}/notices/${numericNoticeId}`}
          className="outline-btn"
        >
          상세로
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
          />
        </div>

        <div className="company-notice-form-actions">
          <Link
            to={`/companies/${numericCompanyId}/notices/${numericNoticeId}`}
            className="outline-btn"
          >
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

export default CompanyNoticeEditPage;
