import { Link } from "react-router-dom";
import "../../css/map/placeCard.css";

function PlaceCard({ place }) {
  const content = (
    <article className="place-card">
      <div>
        <h3>{place.name}</h3>
        <p>{place.address}</p>
        <p className="place-meta">평점 {place.rating} · 리뷰 {place.reviewCount} · {place.distance}</p>
      </div>
      <div className="place-tags">
        {place.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
    </article>
  );

  if (place.type === "repair") return <Link to={`/repair-shops/${place.id}`} className="place-link">{content}</Link>;
  return content;
}

export default PlaceCard;
