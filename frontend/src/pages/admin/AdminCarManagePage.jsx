import { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatusBadge from "../../components/admin/AdminStatusBadge";
import { adminCars } from "../../data/adminDummyData";

function AdminCarManagePage() {
  const [cars, setCars] = useState(adminCars);

  const updateStatus = (id, status) => {
    setCars((prev) => prev.map((car) => car.id === id ? { ...car, status } : car));
  };

  return (
    <div className="admin-page">
      <AdminPageHeader title="매물 관리" description="등록된 중고차 매물의 검수 및 노출 상태를 관리합니다." />
      <section className="admin-panel admin-table-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>번호</th><th>매물명</th><th>판매자</th><th>가격</th><th>등록일</th><th>상태</th><th>관리</th></tr></thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td>{car.id}</td><td><strong>{car.title}</strong></td><td>{car.seller}</td><td>{car.price}</td><td>{car.createdAt}</td><td><AdminStatusBadge value={car.status} /></td>
                  <td><div className="admin-row-actions"><button onClick={() => updateStatus(car.id, "판매중")}>승인</button><button onClick={() => updateStatus(car.id, "노출중지")}>중지</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminCarManagePage;
