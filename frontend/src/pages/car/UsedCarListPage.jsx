import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import CarCard from "../../components/car/CarCard";
import CarSearchBox from "../../components/car/CarSearchBox";
import { carDummyData } from "../../data/carDummyData";
import "../../css/car/usedCarListPage.css";

function UsedCarListPage() {
  const [search, setSearch] = useState({
    keyword: "",
    brand: "",
    region: "",
    minPrice: 100,
    maxPrice: 20000,
    exteriorColor: "",
    interiorColor: "",
    transmission: "",
    fuelType: "",
    carType: "",
  });

  const [sortType, setSortType] = useState("latest");

  const cars = useMemo(() => {
    let result = carDummyData.filter((car) => {
      const keyword = search.keyword.trim().toLowerCase();

      const matchKeyword =
        !keyword ||
        car.title.toLowerCase().includes(keyword) ||
        car.model.toLowerCase().includes(keyword);

      const matchBrand = !search.brand || car.brand === search.brand;
      const matchRegion = !search.region || car.region === search.region;

      const matchPrice =
        car.price >= Number(search.minPrice) &&
        car.price <= Number(search.maxPrice);

      const matchExteriorColor =
        !search.exteriorColor || car.exteriorColor === search.exteriorColor;

      const matchInteriorColor =
        !search.interiorColor || car.interiorColor === search.interiorColor;

      const matchTransmission =
        !search.transmission || car.transmission === search.transmission;

      const matchFuelType = !search.fuelType || car.fuelType === search.fuelType;

      const matchCarType = !search.carType || car.carType === search.carType;

      return (
        matchKeyword &&
        matchBrand &&
        matchRegion &&
        matchPrice &&
        matchExteriorColor &&
        matchInteriorColor &&
        matchTransmission &&
        matchFuelType &&
        matchCarType
      );
    });

    if (sortType === "priceLow") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sortType === "priceHigh") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sortType === "mileageLow") {
      result = [...result].sort((a, b) => a.mileage - b.mileage);
    }

    if (sortType === "latest") {
      result = [...result].sort(
        (a, b) => new Date(b.registeredDate) - new Date(a.registeredDate)
      );
    }

    return result;
  }, [search, sortType]);

  return (
    <main className="used-car-page">
      <CarSearchBox search={search} setSearch={setSearch} />

      <aside className="used-car-right-sidebar">
        <div className="right-sidebar-box">
          <h3>추천 영역</h3>
          <p>나중에 추천 차량, 최근 본 차량, 인기 매물 등을 넣을 예정입니다.</p>
        </div>
      </aside>

      <section className="used-car-main-area">
        <PageTitle
          title="중고차거래"
          description="경매 없이 일반 중고거래 방식으로 구성한 화면입니다."
        >
          <Link to="/cars/register" className="primary-btn">
            차량 판매 등록
          </Link>
        </PageTitle>

        <div className="used-car-content">
          <div className="list-control-row">
            <p>
              총 <strong>{cars.length}</strong>대
            </p>

            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="latest">최근등록순</option>
              <option value="priceLow">낮은가격순</option>
              <option value="priceHigh">높은가격순</option>
              <option value="mileageLow">주행거리 짧은순</option>
            </select>
          </div>

          {cars.length > 0 ? (
            <div className="used-car-card-list">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="empty-car-list">조건에 맞는 차량이 없습니다.</div>
          )}
        </div>
      </section>
    </main>
  );
}

export default UsedCarListPage;