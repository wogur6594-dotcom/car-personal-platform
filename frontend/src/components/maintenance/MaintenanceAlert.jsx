import "../../css/maintenance/maintenanceAlert.css";

function MaintenanceAlert({ alert }) {
  return (
    <div className={`maintenance-alert ${alert.level}`}>
      <strong>{alert.title}</strong>
      <p>{alert.description}</p>
    </div>
  );
}

export default MaintenanceAlert;
