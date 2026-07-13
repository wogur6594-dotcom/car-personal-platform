const DEALER_REVIEWS_KEY = "dealerReviews";

function getStoredReviews() {
  const saved = localStorage.getItem(DEALER_REVIEWS_KEY);

  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("딜러 리뷰 데이터 파싱 오류:", error);
    return [];
  }
}

function saveReviews(reviews) {
  localStorage.setItem(DEALER_REVIEWS_KEY, JSON.stringify(reviews));
  window.dispatchEvent(new Event("dealerReviewChange"));
}

export function getDealerReviews(dealerId) {
  return getStoredReviews()
    .filter((review) => Number(review.dealerId) === Number(dealerId))
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
}

export function getDealerRatingSummary(dealerId) {
  const reviews = getDealerReviews(dealerId);

  if (reviews.length === 0) {
    return {
      averageRating: 0,
      reviewCount: 0,
    };
  }

  const total = reviews.reduce((sum, review) => sum + Number(review.rating), 0);

  return {
    averageRating: Number((total / reviews.length).toFixed(1)),
    reviewCount: reviews.length,
  };
}

export function getMemberDealerReview(dealerId, memberId) {
  return getStoredReviews().find(
    (review) =>
      Number(review.dealerId) === Number(dealerId) &&
      Number(review.memberId) === Number(memberId)
  );
}

export function saveDealerReview({ dealerId, memberId, memberName, rating, content }) {
  const reviews = getStoredReviews();
  const existingIndex = reviews.findIndex(
    (review) =>
      Number(review.dealerId) === Number(dealerId) &&
      Number(review.memberId) === Number(memberId)
  );

  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    const updatedReview = {
      ...reviews[existingIndex],
      rating: Number(rating),
      content: content.trim(),
      updatedAt: now,
    };

    const nextReviews = [...reviews];
    nextReviews[existingIndex] = updatedReview;
    saveReviews(nextReviews);
    return updatedReview;
  }

  const newReview = {
    id: Date.now(),
    dealerId: Number(dealerId),
    memberId: Number(memberId),
    memberName,
    rating: Number(rating),
    content: content.trim(),
    createdAt: now,
    updatedAt: now,
  };

  saveReviews([...reviews, newReview]);
  return newReview;
}

export function deleteDealerReview(reviewId, memberId) {
  const reviews = getStoredReviews();
  const target = reviews.find((review) => Number(review.id) === Number(reviewId));

  if (!target || Number(target.memberId) !== Number(memberId)) {
    return false;
  }

  saveReviews(reviews.filter((review) => Number(review.id) !== Number(reviewId)));
  return true;
}
