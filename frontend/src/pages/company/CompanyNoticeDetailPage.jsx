import { useEffect, useRef, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { companyDummyData } from "../../data/companyDummyData";
import { AUTH_ROLES } from "../../utils/authRole";
import { getLoginUser } from "../../utils/authStorage";
import {
  COMPANY_NOTICE_CATEGORY_LABELS,
  deleteCompanyNotice,
  getCompanyNoticeById,
  increaseCompanyNoticeViewCount,
} from "../../utils/companyNoticeStorage";
import "../../css/company/companyNoticePage.css";

function formatDateTime(dateValue) {
  if (!dateValue) {
    return "-";
  }

  return new Date(dateValue).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CompanyNoticeDetailPage() {
  const { companyId, noticeId } = useParams();

  const navigate = useNavigate();
  const loginUser = getLoginUser();

  const numericCompanyId = Number(companyId);
  const numericNoticeId = Number(noticeId);

  const company = companyDummyData.find(
    (item) => Number(item.id) === numericCompanyId
  );

  const [notice, setNotice] = useState(() =>
    getCompanyNoticeById(numericNoticeId)
  );

  const viewCountUpdatedRef = useRef(false);

  const isCompanyOwner =
    loginUser?.role === AUTH_ROLES.COMPANY &&
    Number(loginUser.companyId) === numericCompanyId;

  const isValidNotice =
    notice &&
    Number(notice.companyId) === numericCompanyId;

  useEffect(() => {
    if (!isValidNotice) {
      return;
    }

    if (viewCountUpdatedRef.current) {
      return;
    }

    viewCountUpdatedRef.current = true;

    const updatedNotice =
      increaseCompanyNoticeViewCount(numericNoticeId);

    if (updatedNotice) {
      setNotice(updatedNotice);
    }
  }, [isValidNotice, numericNoticeId]);

  const handleDelete = () => {
    if (!isCompanyOwner || !notice) {
      return;
    }

    const confirmed = window.confirm(
      `"${notice.title}" 게시글을 삭제하시겠습니까?`
    );

    if (!confirmed) {
      return;
    }

    const deleted = deleteCompanyNotice(notice.id);

    if (!deleted) {
      window.alert("게시글 삭제에 실패했습니다.");
      return;
    }

    navigate(`/companies/${numericCompanyId}/notices`, {
      replace: true,
    });
  };

  if (!company) {
    return (
      <main className="page company-notice-page">
        <PageTitle
          title="회사를 찾을 수 없습니다."
          description="존재하지 않거나 삭제된 회사입니다."
        />

        <Link to="/cars" className="outline-btn">
          중고차 목록으로
        </Link>
      </main>
    );
  }

  if (!isValidNotice) {
    return (
      <main className="page company-notice-page">
        <PageTitle
          title="게시글을 찾을 수 없습니다."
          description="존재하지 않거나 삭제된 게시글입니다."
        />

        <Link
          to={`/companies/${numericCompanyId}/notices`}
          className="outline-btn"
        >
          게시글 목록
        </Link>
      </main>
    );
  }

  return (
    <main className="page company-notice-page">
      <PageTitle
        title={company.name}
        description="회사 게시글 상세 내용입니다."
      >
        <div className="company-notice-title-actions">
          <Link
            to={`/companies/${numericCompanyId}`}
            className="outline-btn"
          >
            회사 페이지
          </Link>

          <Link
            to={`/companies/${numericCompanyId}/notices`}
            className="outline-btn"
          >
            게시글 목록
          </Link>
        </div>
      </PageTitle>

      <article className="company-notice-detail-card">
        <header className="company-notice-detail-header">
          <div className="company-notice-list-badges">
            <span
              className={`company-notice-category-badge ${notice.category.toLowerCase()}`}
            >
              {
                COMPANY_NOTICE_CATEGORY_LABELS[
                  notice.category
                ]
              }
            </span>

            {notice.isPinned && (
              <span className="company-notice-pinned-label">
                중요
              </span>
            )}
          </div>

          <h1>{notice.title}</h1>

          <div className="company-notice-detail-meta">
            <span>작성자 {notice.writerName}</span>

            <span>
              작성일 {formatDateTime(notice.createdAt)}
            </span>

            <span>
              조회{" "}
              {Number(
                notice.viewCount || 0
              ).toLocaleString()}
            </span>
          </div>
        </header>

        <div className="company-notice-detail-content">
          {notice.content
            .split("\n")
            .map((line, index) => (
              <p key={`${index}-${line}`}>
                {line || "\u00a0"}
              </p>
            ))}
        </div>

        <footer className="company-notice-detail-footer">
          <Link
            to={`/companies/${numericCompanyId}/notices`}
            className="outline-btn"
          >
            목록으로
          </Link>

          {isCompanyOwner && (
            <div className="company-notice-owner-actions">
              <Link
                to={`/companies/${numericCompanyId}/notices/${numericNoticeId}/edit`}
                className="company-notice-edit-btn"
              >
                수정
              </Link>

              <button
                type="button"
                className="company-notice-delete-button"
                onClick={handleDelete}
              >
                삭제
              </button>
            </div>
          )}
        </footer>
      </article>
    </main>
  );
}

export default CompanyNoticeDetailPage;