import {
  useEffect,
  useState,
} from "react";
import {
  Link,
} from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import CarCard from "../../components/car/CarCard";
import {
  getCars,
} from "../../utils/carStorage";
import {
  getLoginUser,
} from "../../utils/authStorage";
import {
  getFavoriteCarIds,
  getFavoriteChangeEventName,
} from "../../utils/carFavoriteStorage";
import "../../css/car/favoriteCarPage.css";

function FavoriteCarPage() {
  const loginUser = getLoginUser();

  const [favoriteCars, setFavoriteCars] =
    useState([]);

  const loadFavoriteCars = () => {
    if (
      !loginUser ||
      loginUser.role !== "MEMBER"
    ) {
      setFavoriteCars([]);
      return;
    }

    const favoriteCarIds =
      getFavoriteCarIds(
        loginUser.id
      );

    const cars = getCars().filter(
      (car) =>
        favoriteCarIds.includes(
          Number(car.id)
        )
    );

    setFavoriteCars(cars);
  };

  useEffect(() => {
    loadFavoriteCars();

    const eventName =
      getFavoriteChangeEventName();

    window.addEventListener(
      eventName,
      loadFavoriteCars
    );

    window.addEventListener(
      "storage",
      loadFavoriteCars
    );

    return () => {
      window.removeEventListener(
        eventName,
        loadFavoriteCars
      );

      window.removeEventListener(
        "storage",
        loadFavoriteCars
      );
    };
  }, [loginUser?.id]);

  return (
    <main className="page favorite-car-page">
      <PageTitle
        title="찜한 차량"
        description="관심 있는 차량을 모아서 확인합니다."
      >
        <Link
          to="/cars"
          className="outline-btn"
        >
          차량 목록
        </Link>
      </PageTitle>

      {favoriteCars.length > 0 ? (
        <section className="favorite-car-list">
          {favoriteCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
            />
          ))}
        </section>
      ) : (
        <section className="favorite-car-empty">
          <p>
            찜한 차량이 없습니다.
          </p>

          <Link
            to="/cars"
            className="primary-btn"
          >
            차량 둘러보기
          </Link>
        </section>
      )}
    </main>
  );
}

export default FavoriteCarPage;