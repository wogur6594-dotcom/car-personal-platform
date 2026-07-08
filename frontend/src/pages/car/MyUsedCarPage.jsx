import PageTitle from "../../components/common/PageTitle";
import CarCard from "../../components/car/CarCard";
import { carDummyData } from "../../data/carDummyData";

function MyUsedCarPage() {
  return (
    <main className="page">
      <PageTitle title="내가 등록한 차량" description="로그인 후 내가 올린 판매글을 관리하는 화면입니다." />
      <section className="car-card-list">
        {carDummyData.slice(0, 1).map((car) => <CarCard key={car.id} car={car} />)}
      </section>
    </main>
  );
}

export default MyUsedCarPage;
