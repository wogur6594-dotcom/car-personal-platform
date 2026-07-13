import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { getLoginUser } from "../../utils/authStorage";
import {
  getCompanyDealersByCompanyId,
  updateCompanyDealerStatus,
} from "../../utils/companyDealerStorage";
import "../../css/company/companyDealerManagePage.css";

const STATUS_LABELS = {
  ACTIVE: "재직",
  SUSPENDED: "이용 정지",
  RESIGNED: "퇴사",
};

function CompanyDealerManagePage() {
  const loginUser = getLoginUser();
  const companyId = loginUser?.companyId;

  const [dealers, setDealers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadDealers = () => {
    setDealers(getCompanyDealersByCompanyId(companyId));
  };

  useEffect(() => {
    loadDealers();
    window.addEventListener("companyDealerChange", loadDealers);

    return () => {
      window.removeEventListener("companyDealerChange", loadDealers);
    };
  }, [companyId]);

  const filteredDealers = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return dealers.filter((dealer) => {
      const matchesKeyword =
        !normalizedKeyword ||
        dealer.name.toLowerCase().includes(normalizedKeyword) ||
        dealer.loginId.toLowerCase().includes(normalizedKeyword) ||
        dealer.employeeNumber.toLowerCase().includes(normalizedKeyword);

      const matchesStatus =
        statusFilter === "ALL" || dealer.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [dealers, keyword, statusFilter]);

  const handleStatusChange = (dealer, nextStatus) => {
    const confirmMessages = {
      ACTIVE: `${dealer.name} 딜러를 재직 상태로 변경하시겠습니까?`,
      SUSPENDED:
        `${dealer.name} 딜러 계정을 이용 정지하시겠습니까?\n` +
        "이용 정지된 딜러는 로그인과 매물 등록이 제한됩니다.",
      RESIGNED:
        `${dealer.name} 딜러를 퇴사 처리하시겠습니까?\n` +
        "퇴사 처리된 딜러는 로그인과 매물 등록이 제한됩니다.",
    };

    const isConfirmed = window.confirm(
      confirmMessages[nextStatus]
    );

    if (!isConfirmed) {
      return;
    }

    updateCompanyDealerStatus(dealer.id, nextStatus);
    loadDealers();
  };

  return (
    <main className="page company-dealer-manage-page">
      <PageTitle
        title="소속 딜러 관리"
        description="회사에서 생성한 딜러 계정과 재직 상태를 관리합니다."
      >
        <Link to="/company/dealers/create" className="primary-btn">
          딜러 계정 생성
        </Link>
      </PageTitle>

      <section className="company-dealer-guide">
        <strong>딜러 계정 생성 방식</strong>
        <p>
          딜러는 일반 회원가입으로 생성하지 않고 기업회원이 직접 생성합니다.
          생성된 계정은 최초 로그인 후 비밀번호 변경 기능과 연결할 예정입니다.
        </p>
      </section>

      <section className="company-dealer-filter">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="딜러명, 아이디, 사원번호 검색"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="ALL">전체 상태</option>
          <option value="ACTIVE">재직</option>
          <option value="SUSPENDED">이용 정지</option>
          <option value="RESIGNED">퇴사</option>
        </select>
      </section>

      <section className="company-dealer-table-panel">
        <div className="company-dealer-table-summary">
          <span>검색 결과</span>
          <strong>{filteredDealers.length}명</strong>
        </div>

        <div className="company-dealer-table-wrap">
          <table className="company-dealer-table">
            <thead>
              <tr>
                <th>딜러</th>
                <th>로그인 아이디</th>
                <th>사원번호</th>
                <th>연락처</th>
                <th>생성일</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredDealers.map((dealer) => (
                <tr key={dealer.id}>
                  <td>
                    <div className="company-dealer-profile-cell">
                      <img src={dealer.profileImageUrl} alt={dealer.name} />
                      <div>
                        <strong>{dealer.name}</strong>
                        <span>{dealer.position}</span>
                      </div>
                    </div>
                  </td>
                  <td>{dealer.loginId}</td>
                  <td>{dealer.employeeNumber}</td>
                  <td>{dealer.phone}</td>
                  <td>{dealer.createdAt}</td>
                  <td>
                    <span className={`company-dealer-status ${dealer.status.toLowerCase()}`}>
                      {STATUS_LABELS[dealer.status]}
                    </span>
                  </td>
                  <td>
                    <div className="company-dealer-actions">
                      <Link to={`/dealers/${dealer.id}`}>
                        공개 페이지
                      </Link>

                      <Link
                        to={`/company/dealers/${dealer.id}/edit`}
                      >
                        정보 수정
                      </Link>
                      {dealer.status !== "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(dealer, "ACTIVE")
                          }
                        >
                          재직 처리
                        </button>
                      )}
                      {dealer.status === "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(dealer, "SUSPENDED")
                          }
                        >
                          이용 정지
                        </button>
                      )}
                      {dealer.status !== "RESIGNED" && (
                        <button
                          type="button"
                          className="danger"
                          onClick={() =>
                            handleStatusChange(dealer, "RESIGNED")
                          }
                        >
                          퇴사 처리
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDealers.length === 0 && (
                <tr>
                  <td colSpan="7" className="company-dealer-empty">
                    조건에 맞는 딜러가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default CompanyDealerManagePage;
