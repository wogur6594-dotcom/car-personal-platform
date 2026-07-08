import PageTitle from "../../components/common/PageTitle";
import MyCarCard from "../../components/maintenance/MyCarCard";
import MaintenanceAlert from "../../components/maintenance/MaintenanceAlert";
import { myCarDummyData } from "../../data/maintenanceDummyData";
import { getMaintenanceAlerts } from "../../utils/maintenanceUtils";
import "../../css/maintenance/myCarManagePage.css";

function MyCarManagePage() {
  const car = myCarDummyData[0];
  const alerts = getMaintenanceAlerts(car);

  return (
    <main className="page">
      <PageTitle title="차량관리툴" description="보유 차량의 주행거리와 마지막 점검일 기준으로 알림을 보여줍니다." />
      <section className="maintenance-layout">
        <MyCarCard car={car} />
        <div className="maintenance-alert-list">
          {alerts.map((alert) => <MaintenanceAlert key={alert.id} alert={alert} />)}
        </div>
      </section>
    </main>
  );
}

export default MyCarManagePage;
