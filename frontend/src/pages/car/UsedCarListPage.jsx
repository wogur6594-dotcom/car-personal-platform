import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import CarCard from "../../components/car/CarCard";
import CarSearchBox from "../../components/car/CarSearchBox";
import { carDummyData } from "../../data/carDummyData";
import "../../css/car/usedCarListPage.css";

function UsedCarListPage() {
  const [search, setSearch] = useState({ keyword: "", brand: "", region: "", minPrice: "", maxPrice: "" });
  const [sortType, setSortType] = useState("latest");

  const cars = useMemo(() => {
    let result = carDummyData.filter((car) => {
      const keyword = search.keyword.trim().toLowerCase();
      const matchKeyword = !keyword || car.title.toLowerCase().includes(keyword) || car.model.toLowerCase().includes(keyword);
      const matchBrand = !search.brand || car.brand === search.brand;
      const matchRegion = !search.region || car.region === search.region;
      const matchMin = !search.minPrice || car.price >= Number(search.minPrice);
      const matchMax = !search.maxPrice || car.price <= Number(search.maxPrice);
      return matchKeyword && matchBrand && matchRegion && matchMin && matchMax;
    });

    if (sortType === "priceLow") result = [...result].sort((a, b) => a.price - b.price);
    if (sortType === "priceHigh") result = [...result].sort((a, b) => b.price - a.price);
    if (sortType === "mileageLow") result = [...result].sort((a, b) => a.mileage - b.mileage);
    if (sortType === "latest") result = [...result].sort((a, b) => new Date(b.registeredDate) - new Date(a.registeredDate));
    return result;
  }, [search, sortType]);

  return (
    <main className="page">
      <PageTitle title="중고차거래" description="경매 없이 일반 중고거래 방식으로 구성한 화면입니다.">
        <Link to="/cars/register" className="primary-btn">차량 판매 등록</Link>
      </PageTitle>
      <section className="used-car-layout">
        <CarSearchBox search={search} setSearch={setSearch} />
        <div className="used-car-content">
          <div className="list-control-row">
            <p>총 <strong>{cars.length}</strong>대</p>
            <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
              <option value="latest">최근등록순</option>
              <option value="priceLow">낮은가격순</option>
              <option value="priceHigh">높은가격순</option>
              <option value="mileageLow">주행거리 짧은순</option>
            </select>
          </div>
          <div className="car-card-list">
            {cars.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        </div>
      </section>
    </main>
  );
}

export default UsedCarListPage;
