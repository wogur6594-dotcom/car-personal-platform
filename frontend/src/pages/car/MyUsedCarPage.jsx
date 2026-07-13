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
  getLoginUser,
} from "../../utils/authStorage";
import {
  getCarsBySeller,
  getCarChangeEventName,
} from "../../utils/carStorage";

function MyUsedCarPage() {
  const loginUser = getLoginUser();

  const [myCars, setMyCars] =
    useState([]);

  const loadMyCars = () => {
    if (!loginUser) {
      setMyCars([]);
      return;
    }

    setMyCars(
      getCarsBySeller(
        loginUser.id,
        loginUser.role
      )
    );
  };

  useEffect(() => {
    loadMyCars();

    const eventName =
      getCarChangeEventName();

    window.addEventListener(
      eventName,
      loadMyCars
    );

    window.addEventListener(
      "storage",
      loadMyCars
    );

    return () => {
      window.removeEventListener(
        eventName,
        loadMyCars
      );

      window.removeEventListener(
        "storage",
        loadMyCars
      );
    };
  }, [
    loginUser?.id,
    loginUser?.role,
  ]);

  return (
    <main className="page">
      <PageTitle
        title="내가 등록한 차량"
        description="내가 등록한 판매 차량을 관리합니다."
      >
        <Link
          to="/cars/register"
          className="primary-btn"
        >
          차량 등록
        </Link>
      </PageTitle>

      {myCars.length > 0 ? (
        <section className="car-card-list">
          {myCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
            />
          ))}
        </section>
      ) : (
        <section className="empty-car-list">
          <p>
            등록한 차량이 없습니다.
          </p>

          <Link
            to="/cars/register"
            className="primary-btn"
          >
            첫 차량 등록하기
          </Link>
        </section>
      )}
    </main>
  );
}

export default MyUsedCarPage;