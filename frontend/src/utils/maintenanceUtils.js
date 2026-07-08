const MONTH = 1000 * 60 * 60 * 24 * 30;

export function getMaintenanceAlerts(car) {
  const today = new Date();
  const alerts = [];

  const oilKmGap = car.currentMileage - car.lastOilMileage;
  const oilMonthGap = Math.floor((today - new Date(car.lastOilDate)) / MONTH);

  if (oilKmGap >= 10000 || oilMonthGap >= 6) {
    alerts.push({ id: "oil", level: "danger", title: "엔진오일 교체 필요", description: "10,000km 또는 6개월 기준을 넘었습니다." });
  } else {
    alerts.push({ id: "oil", level: "safe", title: "엔진오일 상태 양호", description: `${10000 - oilKmGap}km 정도 여유가 있습니다.` });
  }

  const tireMonthGap = Math.floor((today - new Date(car.lastTireDate)) / MONTH);
  if (tireMonthGap >= 6) alerts.push({ id: "tire", level: "warning", title: "타이어 점검 권장", description: "최근 타이어 점검일 기준 6개월이 지났습니다." });

  const brakeMonthGap = Math.floor((today - new Date(car.lastBrakeDate)) / MONTH);
  if (brakeMonthGap >= 12) alerts.push({ id: "brake", level: "warning", title: "브레이크 점검 권장", description: "브레이크 점검 주기를 확인해보세요." });

  const batteryMonthGap = Math.floor((today - new Date(car.lastBatteryDate)) / MONTH);
  if (batteryMonthGap >= 24) alerts.push({ id: "battery", level: "warning", title: "배터리 점검 권장", description: "배터리 교체 또는 점검 시기를 확인해보세요." });

  return alerts;
}
