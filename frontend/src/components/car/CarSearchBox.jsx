import "../../css/car/carSearchBox.css";

function CarSearchBox({ search, setSearch }) {
  const minLimit = 100;
  const maxLimit = 20000;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMinPriceChange = (e) => {
    const value = Number(e.target.value);

    setSearch((prev) => ({
      ...prev,
      minPrice: Math.min(value, Number(prev.maxPrice) - 100),
    }));
  };

  const handleMaxPriceChange = (e) => {
    const value = Number(e.target.value);

    setSearch((prev) => ({
      ...prev,
      maxPrice: Math.max(value, Number(prev.minPrice) + 100),
    }));
  };

  const handleReset = () => {
    setSearch({
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
  };

  const minPercent =
    ((Number(search.minPrice) - minLimit) / (maxLimit - minLimit)) * 100;

  const maxPercent =
    ((Number(search.maxPrice) - minLimit) / (maxLimit - minLimit)) * 100;

  return (
    <aside className="car-search-sidebar">
      <div className="car-search-title-box">
        <h2>중고차 검색</h2>
        <p>조건을 선택해서 원하는 차량을 찾아보세요.</p>
      </div>

      <div className="car-search-field">
        <label>브랜드</label>
        <select name="brand" value={search.brand} onChange={handleChange}>
          <option value="">브랜드 전체</option>
          <option value="현대">현대</option>
          <option value="기아">기아</option>
          <option value="제네시스">제네시스</option>
        </select>
      </div>

      <div className="car-search-field">
        <label>모델명</label>
        <input
          name="keyword"
          value={search.keyword}
          onChange={handleChange}
          placeholder="예: 아반떼, K5, G70"
        />
      </div>

      <div className="car-search-field">
        <label>지역</label>
        <select name="region" value={search.region} onChange={handleChange}>
          <option value="">지역 전체</option>
          <option value="서울">서울</option>
          <option value="경기">경기</option>
          <option value="인천">인천</option>
        </select>
      </div>

      <div className="car-search-field">
        <label>가격</label>

        <div className="price-range-text">
          <span>{Number(search.minPrice).toLocaleString()}만원</span>
          <span>{Number(search.maxPrice).toLocaleString()}만원</span>
        </div>

        <div className="double-range-wrap">
          <div className="range-track"></div>

          <div
            className="range-selected"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          ></div>

          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            step="100"
            value={search.minPrice}
            onChange={handleMinPriceChange}
          />

          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            step="100"
            value={search.maxPrice}
            onChange={handleMaxPriceChange}
          />
        </div>

        <div className="price-range-guide">
          <span>100만</span>
          <span>2억</span>
        </div>
      </div>

      <div className="car-search-row">
        <div className="car-search-field">
          <label>외장 색상</label>
          <select
            name="exteriorColor"
            value={search.exteriorColor}
            onChange={handleChange}
          >
            <option value="">전체</option>
            <option value="흰색">흰색</option>
            <option value="검정">검정</option>
            <option value="회색">회색</option>
            <option value="은색">은색</option>
            <option value="파랑">파랑</option>
            <option value="빨강">빨강</option>
          </select>
        </div>

        <div className="car-search-field">
          <label>내장 색상</label>
          <select
            name="interiorColor"
            value={search.interiorColor}
            onChange={handleChange}
          >
            <option value="">전체</option>
            <option value="검정">검정</option>
            <option value="베이지">베이지</option>
            <option value="브라운">브라운</option>
            <option value="회색">회색</option>
          </select>
        </div>
      </div>

      <div className="car-search-row">
        <div className="car-search-field">
          <label>변속기</label>
          <select
            name="transmission"
            value={search.transmission}
            onChange={handleChange}
          >
            <option value="">전체</option>
            <option value="오토">오토</option>
            <option value="수동">수동</option>
          </select>
        </div>

        <div className="car-search-field">
          <label>연료</label>
          <select
            name="fuelType"
            value={search.fuelType}
            onChange={handleChange}
          >
            <option value="">전체</option>
            <option value="가솔린">가솔린</option>
            <option value="디젤">디젤</option>
            <option value="하이브리드">하이브리드</option>
            <option value="전기">전기</option>
            <option value="LPG">LPG</option>
          </select>
        </div>
      </div>

      <div className="car-search-field">
        <label>차량 종류</label>
        <select name="carType" value={search.carType} onChange={handleChange}>
          <option value="">차량 종류 전체</option>
          <option value="경차">경차</option>
          <option value="소형">소형</option>
          <option value="중형">중형</option>
          <option value="대형">대형</option>
          <option value="SUV">SUV</option>
          <option value="트럭">트럭</option>
          <option value="승합">승합</option>
        </select>
      </div>

      <button type="button" className="car-search-reset-btn" onClick={handleReset}>
        초기화
      </button>
    </aside>
  );
}

export default CarSearchBox;