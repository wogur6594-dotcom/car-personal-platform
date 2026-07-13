import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import CarCard from "../../components/car/CarCard";
import { getLoginUser } from "../../utils/authStorage";
import {
  calculateDealerCareer,
  getCompanyDealerById,
} from "../../utils/companyDealerStorage";
import {
  deleteDealerReview,
  getDealerRatingSummary,
  getDealerReviews,
  getMemberDealerReview,
  saveDealerReview,
} from "../../utils/dealerReviewStorage";
import { carDummyData } from "../../data/carDummyData";
import "../../css/dealer/dealerDetailPage.css";

function StarRatingInput({ value, onChange }) {
  return (
    <div className="dealer-star-input" aria-label="별점 선택">
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          type="button"
          className={score <= value ? "active" : ""}
          onClick={() => onChange(score)}
          aria-label={`${score}점`}
        >
          ★
        </button>
      ))}
      <strong>{value}점</strong>
    </div>
  );
}

function DealerDetailPage() {
  const { dealerId } = useParams();
  const loginUser = getLoginUser();
  const dealer = getCompanyDealerById(dealerId);
  const [reviews, setReviews] = useState(() => getDealerReviews(dealerId));
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  const isOwner =
    loginUser?.role === "DEALER" &&
    Number(loginUser?.id) === Number(dealerId);
  const canWriteReview = loginUser?.role === "MEMBER";

  const myReview = useMemo(
    () =>
      canWriteReview
        ? getMemberDealerReview(dealerId, loginUser.id)
        : null,
    [canWriteReview, dealerId, loginUser?.id, reviews]
  );

  useEffect(() => {
    const refreshReviews = () => setReviews(getDealerReviews(dealerId));
    window.addEventListener("dealerReviewChange", refreshReviews);
    return () => window.removeEventListener("dealerReviewChange", refreshReviews);
  }, [dealerId]);

  useEffect(() => {
    if (myReview) {
      setRating(Number(myReview.rating));
      setReviewContent(myReview.content);
    }
  }, [myReview]);

  const dealerCars = carDummyData.filter(
    (car) => car.dealerId === Number(dealerId)
  );

  const ratingSummary = getDealerRatingSummary(dealerId);

  if (!dealer) {
    return (
      <main className="page dealer-detail-page">
        <PageTitle
          title="딜러를 찾을 수 없습니다."
          description="존재하지 않거나 삭제된 딜러 정보입니다."
        />

        <Link to="/cars" className="outline-btn">
          중고차 목록으로
        </Link>
      </main>
    );
  }

  const messageUrl = `/messages/new?receiverType=DEALER&receiverId=${dealer.id}`;

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    if (!reviewContent.trim()) {
      setReviewMessage("리뷰 내용을 입력해주세요.");
      return;
    }

    saveDealerReview({
      dealerId: dealer.id,
      memberId: loginUser.id,
      memberName: loginUser.name,
      rating,
      content: reviewContent,
    });

    setReviewMessage(myReview ? "리뷰가 수정되었습니다." : "리뷰가 등록되었습니다.");
  };

  const handleReviewDelete = () => {
    if (!myReview) return;
    if (!window.confirm("작성한 리뷰를 삭제하시겠습니까?")) return;

    deleteDealerReview(myReview.id, loginUser.id);
    setRating(5);
    setReviewContent("");
    setReviewMessage("리뷰가 삭제되었습니다.");
  };

  return (
    <main className="page dealer-detail-page">
      <PageTitle
        title={`${dealer.name} 딜러`}
        description="딜러 공개 페이지입니다."
      >
        <div className="dealer-page-title-actions">
          {isOwner && (
            <Link to="/dealer/profile" className="primary-btn">
              내 프로필 수정
            </Link>
          )}
          <Link to="/cars" className="outline-btn">
            중고차 목록으로
          </Link>
        </div>
      </PageTitle>

      <section className="dealer-profile-section">
        <div className="dealer-profile-card">
          <div className="dealer-profile-image">
            <img src={dealer.profileImageUrl} alt={dealer.name} />
          </div>

          <div className="dealer-profile-info">
            <span className="dealer-badge">{dealer.responseStatus}</span>

            <h2>{dealer.name}</h2>

            <p className="dealer-position">
              {dealer.position} · {dealer.job || "중고차 판매"}
            </p>

            <div className="dealer-company-row">
              <span>소속 회사</span>
              <Link to={`/companies/${dealer.companyId}`}>
                {dealer.companyName}
              </Link>
            </div>

            <p className="dealer-introduction">
              {dealer.introduction ||
                "딜러가 아직 소개문구를 작성하지 않았습니다."}
            </p>

            <div className="dealer-action-row">
              {!isOwner && (
                <Link to={messageUrl} className="primary-btn">
                  메세지로 문의하기
                </Link>
              )}

              {isOwner && (
                <Link to="/dealer/profile" className="primary-btn">
                  프로필 수정하기
                </Link>
              )}

              <Link
                to={`/companies/${dealer.companyId}`}
                className="outline-btn"
              >
                회사 페이지 보기
              </Link>
            </div>
          </div>
        </div>

        <div className="dealer-summary-card">
          <div>
            <span>활동 지역</span>
            <strong>{dealer.region}</strong>
          </div>

          <div>
            <span>경력</span>
            <strong>{calculateDealerCareer(dealer.careerStartDate)}</strong>
            <small>{dealer.careerStartDate} 기준</small>
          </div>

          <div>
            <span>판매 건수</span>
            <strong>{dealer.salesCount}건</strong>
          </div>

          <div>
            <span>고객 평점</span>
            <strong>
              {ratingSummary.reviewCount > 0
                ? `${ratingSummary.averageRating}점`
                : "평점 없음"}
            </strong>
            <small>리뷰 {ratingSummary.reviewCount}개</small>
          </div>
        </div>
      </section>

      <section className="dealer-review-section">
        <div className="dealer-section-title">
          <div>
            <h2>고객 리뷰</h2>
            <p>거래 및 상담 경험을 바탕으로 작성된 딜러 평가입니다.</p>
          </div>
          <strong>
            {ratingSummary.reviewCount > 0
              ? `평균 ${ratingSummary.averageRating}점`
              : "등록된 평점 없음"}
          </strong>
        </div>

        {canWriteReview && (
          <form className="dealer-review-form" onSubmit={handleReviewSubmit}>
            <div className="dealer-review-form-header">
              <div>
                <h3>{myReview ? "내 리뷰 수정" : "리뷰 작성"}</h3>
                <p>딜러에 대한 별점과 리뷰를 작성해주세요.</p>
              </div>
              <StarRatingInput value={rating} onChange={setRating} />
            </div>

            <textarea
              value={reviewContent}
              onChange={(event) => setReviewContent(event.target.value)}
              maxLength="500"
              rows="5"
              placeholder="상담 응대, 차량 설명, 거래 과정 등에 대한 경험을 작성해주세요."
            />

            <div className="dealer-review-form-bottom">
              <span>{reviewContent.length} / 500자</span>
              <div>
                {myReview && (
                  <button
                    type="button"
                    className="dealer-review-delete-btn"
                    onClick={handleReviewDelete}
                  >
                    리뷰 삭제
                  </button>
                )}
                <button type="submit" className="primary-btn">
                  {myReview ? "리뷰 수정" : "리뷰 등록"}
                </button>
              </div>
            </div>

            {reviewMessage && (
              <p className="dealer-review-message">{reviewMessage}</p>
            )}
          </form>
        )}

        {!loginUser && (
          <div className="dealer-review-login-guide">
            리뷰 작성은 일반회원 로그인 후 이용할 수 있습니다.
            <Link to="/login">로그인</Link>
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="dealer-review-list">
            {reviews.map((review) => (
              <article key={review.id} className="dealer-review-item">
                <div className="dealer-review-item-header">
                  <div>
                    <strong>{review.memberName}</strong>
                    <span className="dealer-review-stars">
                      {"★".repeat(Number(review.rating))}
                      <em>{review.rating}점</em>
                    </span>
                  </div>
                  <time>
                    {new Date(review.updatedAt || review.createdAt).toLocaleDateString("ko-KR")}
                  </time>
                </div>
                <p>{review.content}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="dealer-empty-box">
            아직 작성된 고객 리뷰가 없습니다.
          </div>
        )}
      </section>

      <section className="dealer-car-section">
        <div className="dealer-section-title">
          <div>
            <h2>판매 중인 차량</h2>
            <p>해당 딜러가 등록한 차량 목록입니다.</p>
          </div>

          <strong>총 {dealerCars.length}대</strong>
        </div>

        {dealerCars.length > 0 ? (
          <div className="dealer-car-list">
            {dealerCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="dealer-empty-box">
            현재 판매 중인 차량이 없습니다.
          </div>
        )}
      </section>
    </main>
  );
}

export default DealerDetailPage;
