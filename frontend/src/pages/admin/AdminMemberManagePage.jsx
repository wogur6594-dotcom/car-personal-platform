import { useMemo, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatusBadge from "../../components/admin/AdminStatusBadge";
import { adminMembers } from "../../data/adminDummyData";

function AdminMemberManagePage() {
  const [members, setMembers] = useState(adminMembers);
  const [keyword, setKeyword] = useState("");

  const filteredMembers = useMemo(
    () => members.filter((member) =>
      member.name.includes(keyword) || member.email.includes(keyword)
    ),
    [members, keyword]
  );

  const toggleMemberStatus = (id) => {
    setMembers((prev) => prev.map((member) => {
      if (member.id !== id) return member;
      return { ...member, status: member.status === "이용정지" ? "정상" : "이용정지" };
    }));
  };

  return (
    <div className="admin-page">
      <AdminPageHeader title="회원 관리" description="회원 정보와 서비스 이용 상태를 관리합니다." />

      <div className="admin-filter-bar">
        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="이름 또는 이메일 검색" />
      </div>

      <section className="admin-panel admin-table-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>번호</th><th>회원명</th><th>이메일</th><th>유형</th><th>가입일</th><th>상태</th><th>관리</th></tr></thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>{member.id}</td><td><strong>{member.name}</strong></td><td>{member.email}</td><td>{member.role}</td><td>{member.joinedAt}</td>
                  <td><AdminStatusBadge value={member.status} /></td>
                  <td><button className="admin-outline-button" type="button" onClick={() => toggleMemberStatus(member.id)}>{member.status === "이용정지" ? "정지 해제" : "이용 정지"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminMemberManagePage;
