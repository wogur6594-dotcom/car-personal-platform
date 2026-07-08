import "../../css/maintenance/myCarCard.css";

function MyCarCard({ car }) {
  return (
    <article className="my-car-card">
      <h3>{car.carName}</h3>
      <p>{car.carNumber}</p>
      <strong>{car.currentMileage.toLocaleString()}km</strong>
    </article>
  );
}

export default MyCarCard;
