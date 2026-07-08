import "../../css/car/carSearchBox.css";

function CarSearchBox({ search, setSearch }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setSearch({ keyword: "", brand: "", region: "", minPrice: "", maxPrice: "" });
  };

  return (
    <aside className="car-search-box">
      <h2>중고차 검색</h2>
      <input name="keyword" value={search.keyword} onChange={handleChange} placeholder="모델명 검색" />
      <select name="brand" value={search.brand} onChange={handleChange}>
        <option value="">브랜드 전체</option>
        <option value="현대">현대</option>
        <option value="기아">기아</option>
        <option value="제네시스">제네시스</option>
      </select>
      <select name="region" value={search.region} onChange={handleChange}>
        <option value="">지역 전체</option>
        <option value="서울">서울</option>
        <option value="경기">경기</option>
        <option value="인천">인천</option>
      </select>
      <div className="price-row">
        <input name="minPrice" value={search.minPrice} onChange={handleChange} placeholder="최소" />
        <input name="maxPrice" value={search.maxPrice} onChange={handleChange} placeholder="최대" />
      </div>
      <button type="button" onClick={handleReset}>초기화</button>
    </aside>
  );
}

export default CarSearchBox;
