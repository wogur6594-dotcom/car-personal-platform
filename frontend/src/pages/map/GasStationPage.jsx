import PageTitle from "../../components/common/PageTitle";
import KakaoMap from "../../components/map/KakaoMap";
import PlaceCard from "../../components/map/PlaceCard";
import { placeDummyData } from "../../data/placeDummyData";
import "../../css/map/mapPage.css";

function GasStationPage() {
  const gasStations = placeDummyData.filter((place) => place.type === "gas");

  return (
    <main className="page">
      <PageTitle title="주유소 찾기" description="카카오맵 API 연결 전 화면 구조입니다." />
      <section className="map-layout">
        <KakaoMap />
        <div className="place-list">
          {gasStations.map((place) => <PlaceCard key={place.id} place={place} />)}
        </div>
      </section>
    </main>
  );
}

export default GasStationPage;
