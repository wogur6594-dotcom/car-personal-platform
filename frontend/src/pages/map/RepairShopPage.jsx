import PageTitle from "../../components/common/PageTitle";
import KakaoMap from "../../components/map/KakaoMap";
import PlaceCard from "../../components/map/PlaceCard";
import { placeDummyData } from "../../data/placeDummyData";
import "../../css/map/mapPage.css";

function RepairShopPage() {
  const repairShops = placeDummyData.filter((place) => place.type === "repair");

  return (
    <main className="page">
      <PageTitle title="정비소 찾기" description="정비소 리뷰와 카카오맵 API를 연결할 예정입니다." />
      <section className="map-layout">
        <KakaoMap />
        <div className="place-list">
          <div className="map-tab-row">
            <a href="/repair-shops">정비소</a>
            <a href="/gas-stations">주유소</a>
          </div>
          {repairShops.map((place) => <PlaceCard key={place.id} place={place} />)}
        </div>
      </section>
    </main>
  );
}

export default RepairShopPage;
