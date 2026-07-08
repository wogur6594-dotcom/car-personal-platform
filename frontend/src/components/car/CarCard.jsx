import { Link } from "react-router-dom";
import "../../css/car/carCard.css";

function CarCard({ car }) {
  return (
    <article className="car-card">
      <Link to={`/cars/${car.id}`} className="car-card-link">
        <div className="car-image-box">
          <img src={car.imageUrl} alt={car.title} />
          <span className="car-status">{car.status}</span>
        </div>
        <div className="car-card-body">
          <h3>{car.title}</h3>
          <p className="car-sub-info">
            {car.year}년식 · {car.mileage.toLocaleString()}km · {car.region}
          </p>
          <div className="car-price">{car.price.toLocaleString()}만원</div>
          <div className="car-card-footer">
            <span>{car.sellerName}</span>
            <span>{car.registeredDate}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default CarCard;
