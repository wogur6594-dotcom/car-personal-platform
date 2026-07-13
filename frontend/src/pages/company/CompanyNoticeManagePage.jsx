import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { companyDummyData } from "../../data/companyDummyData";
import { AUTH_ROLES } from "../../utils/authRole";
import { getLoginUser } from "../../utils/authStorage";
import {
  COMPANY_NOTICE_CATEGORY_LABELS,
  deleteCompanyNotice,
  getCompanyNoticesByCompanyId,
  toggleCompanyNoticePinned,
} from "../../utils/companyNoticeStorage";
import "../../css/company/companyNoticePage.css";

function formatDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  return new Date(dateValue).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function CompanyNoticeManagePage() {
  const { companyId } = useParams();
  const loginUser = getLoginUser();

  const numericCompanyId = Number(companyId);

  const company = companyDummyData.find(
    (item) => Number(item.id) === numericCompanyId
  );

  const isCompanyOwner =
    loginUser?.role === AUTH_ROLES.COMPANY &&
    Number(loginUser.companyId) === numericCompanyId;

  const [notices, setNotices] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("ALL");

  const loadNotices = () => {
    if (!numericCompanyId) {
      setNotices([]);
      return;
    }

    setNotices(
      getCompanyNoticesByCompanyId(numericCompanyId)
    );
  };

  useEffect(() => {
    loadNotices();

    const handleNoticeChange = () => {
      loadNotices();
    };

    window.addEventListener(
      "companyNoticeChange",
      handleNoticeChange
    );

    return () => {
      window.removeEventListener(
        "companyNoticeChange",
        handleNoticeChange
      );
    };
  }, [numericCompanyId]);

  const filteredNotices = useMemo(() => {
    const normalizedKeyword = keyword
      .trim()
      .toLowerCase();

    return notices.filter((notice) => {
      const categoryMatched =
        category === "ALL" ||
        notice.category === category;

      const keywordMatched =
        !normalizedKeyword ||
        notice.title
          .toLowerCase()
          .includes(normalizedKeyword) ||
        notice.content
          .toLowerCase()
          .includes(normalizedKeyword);

      return categoryMatched && keywordMatched;
    });
  }, [notices, keyword, category]);

  const handleTogglePinned = (noticeId) => {
    if (!isCompanyOwner) {
      return;
    }

    toggleCompanyNoticePinned(noticeId);
  };

  const handleDelete = (notice) => {
    if (!isCompanyOwner) {
      return;
    }

    const confirmed = window.confirm(
      `"${notice.title}" 게시글을 삭제하시겠습니까?`
    );

    if (!confirmed) {
      return;
    }

    deleteCompanyNotice(notice.id);
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

  return (
    <main className="page company-notice-page">
      <PageTitle
        title={`${company.name} 게시판`}
        description="회사의 공지사항과 새로운 소식을 확인할 수 있습니다."
      >
        <div className="company-notice-title-actions">
          <Link
            to={`/companies/${company.id}`}
            className="outline-btn"
          >
            회사 페이지
          </Link>

          {isCompanyOwner && (
            <Link
              to={`/companies/${company.id}/notices/create`}
              className="primary-btn"
            >
              게시글 작성
            </Link>
          )}
        </div>
      </PageTitle>

      <section className="company-notice-manage-card">
        <div className="company-notice-filter">
          <div className="company-notice-search">
            <label htmlFor="company-notice-keyword">
              게시글 검색
            </label>

            <input
              id="company-notice-keyword"
              type="text"
              value={keyword}
              onChange={(event) =>
                setKeyword(event.target.value)
              }
              placeholder="제목 또는 내용 검색"
            />
          </div>

          <div className="company-notice-category-filter">
            <label htmlFor="company-notice-category">
              게시글 분류
            </label>

            <select
              id="company-notice-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              <option value="ALL">전체</option>
              <option value="NOTICE">공지사항</option>
              <option value="NEWS">회사 소식</option>
            </select>
          </div>

          <button
            type="button"
            className="outline-btn company-notice-reset-btn"
            onClick={() => {
              setKeyword("");
              setCategory("ALL");
            }}
          >
            초기화
          </button>
        </div>

        <div className="company-notice-result-info">
          <strong>{filteredNotices.length}개</strong>
          <span>의 게시글이 조회되었습니다.</span>
        </div>

        <div className="company-notice-table-wrap">
          <table className="company-notice-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>분류</th>
                <th>제목</th>
                <th>작성일</th>
                <th>조회수</th>

                {isCompanyOwner && (
                  <>
                    <th>상단 고정</th>
                    <th>관리</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice, index) => (
                  <tr key={notice.id}>
                    <td>
                      {filteredNotices.length - index}
                    </td>

                    <td>
                      <span
                        className={`company-notice-category-badge ${notice.category.toLowerCase()}`}
                      >
                        {
                          COMPANY_NOTICE_CATEGORY_LABELS[
                            notice.category
                          ]
                        }
                      </span>
                    </td>

                    <td className="company-notice-title-cell">
                      <Link
                        to={`/companies/${company.id}/notices/${notice.id}`}
                      >
                        {notice.isPinned && (
                          <span className="company-notice-pinned-label">
                            중요
                          </span>
                        )}

                        {notice.title}
                      </Link>
                    </td>

                    <td>{formatDate(notice.createdAt)}</td>

                    <td>
                      {Number(
                        notice.viewCount || 0
                      ).toLocaleString()}
                    </td>

                    {isCompanyOwner && (
                      <>
                        <td>
                          <button
                            type="button"
                            className={
                              notice.isPinned
                                ? "company-notice-pin-btn active"
                                : "company-notice-pin-btn"
                            }
                            onClick={() =>
                              handleTogglePinned(notice.id)
                            }
                          >
                            {notice.isPinned
                              ? "고정 해제"
                              : "상단 고정"}
                          </button>
                        </td>

                        <td>
                          <div className="company-notice-action-buttons">
                            <Link
                              to={`/companies/${company.id}/notices/${notice.id}/edit`}
                              className="company-notice-edit-btn"
                            >
                              수정
                            </Link>

                            <button
                              type="button"
                              className="company-notice-delete-btn"
                              onClick={() =>
                                handleDelete(notice)
                              }
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isCompanyOwner ? 7 : 5}
                    className="company-notice-empty"
                  >
                    조건에 맞는 게시글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="company-notice-mobile-list">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <article
                key={notice.id}
                className="company-notice-mobile-card"
              >
                <div className="company-notice-mobile-top">
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

                <Link
                  to={`/companies/${company.id}/notices/${notice.id}`}
                  className="company-notice-mobile-title"
                >
                  {notice.title}
                </Link>

                <div className="company-notice-mobile-meta">
                  <span>{formatDate(notice.createdAt)}</span>

                  <span>
                    조회{" "}
                    {Number(
                      notice.viewCount || 0
                    ).toLocaleString()}
                  </span>
                </div>

                {isCompanyOwner && (
                  <div className="company-notice-mobile-actions">
                    <button
                      type="button"
                      className={
                        notice.isPinned
                          ? "company-notice-pin-btn active"
                          : "company-notice-pin-btn"
                      }
                      onClick={() =>
                        handleTogglePinned(notice.id)
                      }
                    >
                      {notice.isPinned
                        ? "고정 해제"
                        : "상단 고정"}
                    </button>

                    <Link
                      to={`/companies/${company.id}/notices/${notice.id}/edit`}
                      className="company-notice-edit-btn"
                    >
                      수정
                    </Link>

                    <button
                      type="button"
                      className="company-notice-delete-btn"
                      onClick={() =>
                        handleDelete(notice)
                      }
                    >
                      삭제
                    </button>
                  </div>
                )}
              </article>
            ))
          ) : (
            <p className="company-notice-mobile-empty">
              조건에 맞는 게시글이 없습니다.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default CompanyNoticeManagePage;