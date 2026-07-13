const FAVORITE_STORAGE_KEY = "carFavorites";
const FAVORITE_CHANGE_EVENT = "carFavoriteChange";

function getAllFavorites() {
  const savedFavorites =
    localStorage.getItem(FAVORITE_STORAGE_KEY);

  if (!savedFavorites) {
    return [];
  }

  try {
    const parsedFavorites =
      JSON.parse(savedFavorites);

    return Array.isArray(parsedFavorites)
      ? parsedFavorites
      : [];
  } catch (error) {
    console.error(
      "찜 데이터 불러오기 오류:",
      error
    );

    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(
    FAVORITE_STORAGE_KEY,
    JSON.stringify(favorites)
  );

  window.dispatchEvent(
    new Event(FAVORITE_CHANGE_EVENT)
  );
}

export function getFavoriteChangeEventName() {
  return FAVORITE_CHANGE_EVENT;
}

export function isCarFavorite(
  memberId,
  carId
) {
  return getAllFavorites().some(
    (favorite) =>
      Number(favorite.memberId) ===
        Number(memberId) &&
      Number(favorite.carId) ===
        Number(carId)
  );
}

export function getFavoriteCarIds(
  memberId
) {
  return getAllFavorites()
    .filter(
      (favorite) =>
        Number(favorite.memberId) ===
        Number(memberId)
    )
    .map((favorite) =>
      Number(favorite.carId)
    );
}

export function addCarFavorite(
  memberId,
  carId
) {
  const favorites =
    getAllFavorites();

  const alreadyFavorite =
    favorites.some(
      (favorite) =>
        Number(favorite.memberId) ===
          Number(memberId) &&
        Number(favorite.carId) ===
          Number(carId)
    );

  if (alreadyFavorite) {
    return false;
  }

  const newFavorite = {
    id: Date.now(),
    memberId: Number(memberId),
    carId: Number(carId),
    createdAt:
      new Date().toISOString(),
  };

  saveFavorites([
    newFavorite,
    ...favorites,
  ]);

  return true;
}

export function removeCarFavorite(
  memberId,
  carId
) {
  const favorites =
    getAllFavorites();

  const nextFavorites =
    favorites.filter(
      (favorite) =>
        !(
          Number(favorite.memberId) ===
            Number(memberId) &&
          Number(favorite.carId) ===
            Number(carId)
        )
    );

  saveFavorites(nextFavorites);

  return true;
}

export function toggleCarFavorite(
  memberId,
  carId
) {
  const favorite =
    isCarFavorite(
      memberId,
      carId
    );

  if (favorite) {
    removeCarFavorite(
      memberId,
      carId
    );

    return false;
  }

  addCarFavorite(
    memberId,
    carId
  );

  return true;
}

export function removeFavoritesByCarId(
  carId
) {
  const favorites =
    getAllFavorites();

  const nextFavorites =
    favorites.filter(
      (favorite) =>
        Number(favorite.carId) !==
        Number(carId)
    );

  saveFavorites(nextFavorites);
}