import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import {
  deleteCar,
  getCarById,
  updateCarStatus,
} from "../../utils/carStorage";
import {
  getLoginUser,
} from "../../utils/authStorage";
import {
  getFavoriteChangeEventName,
  isCarFavorite,
  removeFavoritesByCarId,
  toggleCarFavorite,
} from "../../utils/carFavoriteStorage";
import "../../css/car/usedCarDetailPage.css";

function UsedCarDetailPage() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const loginUser = getLoginUser();
  const car = getCarById(carId);

  const [isFavorite, setIsFavorite] =
    useState(false);

  const isOwner =
    Boolean(loginUser && car) &&
    Number(loginUser.id) ===
      Number(car?.sellerId) &&
    loginUser.role === car?.sellerType;

  const isSold =
    car?.status === "판매완료";

  useEffect(() => {
    if (
      !loginUser ||
      loginUser.role !== "MEMBER" ||
      !car
    ) {
      setIsFavorite(false);
      return undefined;
    }

    const loadFavoriteState = () => {
      setIsFavorite(
        isCarFavorite(
          loginUser.id,
          car.id
        )
      );
    };

    loadFavoriteState();

    const eventName =
      getFavoriteChangeEventName();

    window.addEventListener(
      eventName,
      loadFavoriteState
    );

    window.addEventListener(
      "storage",
      loadFavoriteState
    );

    return () => {
      window.removeEventListener(
        eventName,
        loadFavoriteState
      );

      window.removeEventListener(
        "storage",
        loadFavoriteState
      );
    };
  }, [
    loginUser?.id,
    loginUser?.role,
    car?.id,
  ]);

  if (!car) {
    return (
      <main className="page">
        <PageTitle
          title="차량을 찾을 수 없습니다."
          description="존재하지 않거나 삭제된 매물입니다."
        />

        <Link
          to="/cars"
          className="text-btn"
        >
          목록으로 돌아가기
        </Link>
      </main>
    );
  }

  const messageUrl =
    `/messages/new?carId=${car.id}` +
    `&receiverType=${car.sellerType}` +
    `&receiverId=${car.sellerId}`;

  const handleFavorite = () => {
    if (!loginUser) {
      navigate("/login", {
        state: {
          from: `/cars/${car.id}`,
        },
      });

      return;
    }

    if (loginUser.role !== "MEMBER") {
      window.alert(
        "찜하기는 일반회원만 이용할 수 있습니다."
      );

      return;
    }

    if (isOwner) {
      window.alert(
        "본인이 등록한 차량은 찜할 수 없습니다."
      );

      return;
    }

    if (isSold) {
      window.alert(
        "판매 완료된 차량은 찜할 수 없습니다."
      );

      return;
    }

    const nextFavorite =
      toggleCarFavorite(
        loginUser.id,
        car.id
      );

    setIsFavorite(nextFavorite);
  };

  const handleStatusChange = () => {
    if (!isOwner) {
      navigate("/forbidden");
      return;
    }

    const nextStatus = isSold
      ? "판매중"
      : "판매완료";

    const confirmMessage = isSold
      ? "이 차량을 다시 판매중 상태로 변경하시겠습니까?"
      : "이 차량을 판매완료 상태로 변경하시겠습니까?";

    const isConfirmed =
      window.confirm(confirmMessage);

    if (!isConfirmed) {
      return;
    }

    const updatedCar =
      updateCarStatus(
        car.id,
        nextStatus
      );

    if (!updatedCar) {
      window.alert(
        "차량 상태 변경에 실패했습니다."
      );

      return;
    }

    navigate(`/cars/${car.id}`, {
      replace: true,
      state: {
        message:
          `차량 상태가 ${nextStatus}(으)로 변경되었습니다.`,
      },
    });

    window.location.reload();
  };

  const handleDelete = () => {
    if (!isOwner) {
      navigate("/forbidden");
      return;
    }

    const isConfirmed =
      window.confirm(
        "이 차량 매물을 삭제하시겠습니까?\n" +
        "삭제한 차량은 복구할 수 없습니다."
      );

    if (!isConfirmed) {
      return;
    }

    const deleted =
      deleteCar(car.id);

    if (!deleted) {
      window.alert(
        "차량 삭제에 실패했습니다."
      );

      return;
    }

    removeFavoritesByCarId(
      car.id
    );

    navigate("/member/cars", {
      replace: true,
      state: {
        message:
          "차량 매물이 삭제되었습니다.",
      },
    });
  };

  return (
    <main className="page used-car-detail-page">
      <PageTitle
        title={car.title}
        description="중고차 거래 상세 화면입니다."
      >
        <Link
          to="/cars"
          className="outline-btn"
        >
          목록으로
        </Link>
      </PageTitle>

      {location.state?.message && (
        <div className="car-detail-success-message">
          {location.state.message}
        </div>
      )}

      <section className="car-detail-layout">
        <div className="car-detail-left">
          <div className="car-detail-image">
            <img
              src={car.imageUrl}
              alt={car.title}
            />

            <span
              className={
                `car-detail-status ${
                  isSold ? "sold" : ""
                }`
              }
            >
              {car.status}
            </span>
          </div>

          {Array.isArray(
            car.imageUrls
          ) &&
            car.imageUrls.length > 1 && (
              <div className="car-detail-thumbnail-list">
                {car.imageUrls.map(
                  (
                    imageUrl,
                    index
                  ) => (
                    <div
                      key={
                        `${imageUrl}-${index}`
                      }
                      className="car-detail-thumbnail"
                    >
                      <img
                        src={imageUrl}
                        alt={
                          `${car.title} ${
                            index + 1
                          }`
                        }
                      />
                    </div>
                  )
                )}
              </div>
            )}

          <section className="detail-section">
            <h2>차량 설명</h2>

            <p>{car.description}</p>
          </section>
        </div>

        <aside className="car-detail-info">
          <div className="detail-price-box">
            <p className="detail-status-text">
              {car.status}
            </p>

            <strong>
              {Number(
                car.price
              ).toLocaleString()}
              만원
            </strong>
          </div>

          <section className="detail-section">
            <h2>차량 정보</h2>

            <div className="detail-info-grid">
              <div className="detail-info-item">
                <span>브랜드</span>
                <strong>
                  {car.brand}
                </strong>
              </div>

              <div className="detail-info-item">
                <span>모델명</span>
                <strong>
                  {car.model}
                </strong>
              </div>

              <div className="detail-info-item">
                <span>연식</span>
                <strong>
                  {car.year}년식
                </strong>
              </div>

              <div className="detail-info-item">
                <span>주행거리</span>
                <strong>
                  {Number(
                    car.mileage
                  ).toLocaleString()}
                  km
                </strong>
              </div>

              <div className="detail-info-item">
                <span>지역</span>
                <strong>
                  {car.region}
                </strong>
              </div>

              <div className="detail-info-item">
                <span>차량 종류</span>
                <strong>
                  {car.carType}
                </strong>
              </div>

              <div className="detail-info-item">
                <span>연료</span>
                <strong>
                  {car.fuelType}
                </strong>
              </div>

              <div className="detail-info-item">
                <span>변속기</span>
                <strong>
                  {car.transmission}
                </strong>
              </div>

              <div className="detail-info-item">
                <span>외장 색상</span>
                <strong>
                  {car.exteriorColor}
                </strong>
              </div>

              <div className="detail-info-item">
                <span>내장 색상</span>
                <strong>
                  {car.interiorColor}
                </strong>
              </div>
            </div>
          </section>

          <section className="detail-section seller-section">
            <h2>판매자 정보</h2>

            <div className="seller-card">
              <div>
                <span className="seller-type">
                  {car.sellerTypeName}
                </span>

                {car.sellerType ===
                "DEALER" ? (
                  <Link
                    to={
                      `/dealers/${car.dealerId}`
                    }
                    className="seller-name-link"
                  >
                    {car.dealerName}
                  </Link>
                ) : (
                  <span className="seller-name-text">
                    {car.sellerName}
                  </span>
                )}
              </div>

              {car.sellerType ===
                "DEALER" && (
                <div className="seller-company-row">
                  <span>
                    소속 회사
                  </span>

                  <Link
                    to={
                      `/companies/${car.companyId}`
                    }
                    className="company-name-link"
                  >
                    {car.companyName}
                  </Link>
                </div>
              )}

              <div className="seller-company-row">
                <span>등록일</span>

                <strong>
                  {car.registeredDate}
                </strong>
              </div>
            </div>
          </section>

          {isOwner ? (
            <div className="car-owner-action-box">
              <p>
                내가 등록한 차량입니다.
              </p>

              <Link
                to={
                  `/cars/${car.id}/edit`
                }
                className="primary-btn detail-main-btn"
              >
                차량 정보 수정
              </Link>

              <button
                type="button"
                className="outline-btn detail-main-btn"
                onClick={
                  handleStatusChange
                }
              >
                {isSold
                  ? "판매 다시 시작"
                  : "판매 완료 처리"}
              </button>

              <button
                type="button"
                className="car-delete-btn detail-main-btn"
                onClick={handleDelete}
              >
                차량 삭제
              </button>
            </div>
          ) : (
            <div className="detail-action-box">
              {isSold ? (
                <button
                  type="button"
                  className="primary-btn detail-main-btn"
                  disabled
                >
                  판매 완료된 차량
                </button>
              ) : (
                <Link
                  to={messageUrl}
                  className="primary-btn detail-main-btn"
                >
                  메세지로 문의하기
                </Link>
              )}

              <button
                type="button"
                className={
                  isFavorite
                    ? "favorite-active-btn detail-main-btn"
                    : "outline-btn detail-main-btn"
                }
                disabled={isSold}
                onClick={
                  handleFavorite
                }
              >
                {isFavorite
                  ? "찜 해제"
                  : "찜하기"}
              </button>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

export default UsedCarDetailPage;