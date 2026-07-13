import { dealerDummyData } from "../data/dealerDummyData";

const COMPANY_DEALERS_KEY = "companyDealers";

function getCareerStartDateFromText(career) {
  const years = Number.parseInt(String(career || "0"), 10);
  const date = new Date();
  date.setFullYear(date.getFullYear() - (Number.isNaN(years) ? 0 : years));
  return date.toISOString().slice(0, 10);
}

function normalizeDealer(dealer) {
  return {
    ...dealer,
    loginId: dealer.loginId || "dealer",
    email: dealer.email || "dealer@autocare.co.kr",
    phone: dealer.phone || "010-1234-5678",
    employeeNumber: dealer.employeeNumber || "D-001",
    status: dealer.status || "ACTIVE",
    createdAt: dealer.createdAt || "2026-07-01",
    careerStartDate:
      dealer.careerStartDate || getCareerStartDateFromText(dealer.career),
  };
}

function createSeedData() {
  return dealerDummyData.map(normalizeDealer);
}

export function calculateDealerCareer(careerStartDate) {
  if (!careerStartDate) return "경력 정보 없음";

  const startDate = new Date(`${careerStartDate}T00:00:00`);
  const today = new Date();

  if (Number.isNaN(startDate.getTime()) || startDate > today) {
    return "1년 미만";
  }

  let years = today.getFullYear() - startDate.getFullYear();
  const anniversary = new Date(
    today.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  if (today < anniversary) years -= 1;

  return years > 0 ? `${years}년` : "1년 미만";
}

export function getCompanyDealers() {
  const saved = localStorage.getItem(COMPANY_DEALERS_KEY);

  if (!saved) {
    const seed = createSeedData();
    localStorage.setItem(COMPANY_DEALERS_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    const parsed = JSON.parse(saved);
    const normalized = parsed.map(normalizeDealer);
    localStorage.setItem(COMPANY_DEALERS_KEY, JSON.stringify(normalized));
    return normalized;
  } catch (error) {
    console.error("회사 딜러 데이터 파싱 오류:", error);
    const seed = createSeedData();
    localStorage.setItem(COMPANY_DEALERS_KEY, JSON.stringify(seed));
    return seed;
  }
}

export function getCompanyDealersByCompanyId(companyId) {
  return getCompanyDealers().filter(
    (dealer) => Number(dealer.companyId) === Number(companyId)
  );
}

export function createCompanyDealer(dealerData) {
  const dealers = getCompanyDealers();
  const nextId = dealers.length > 0
    ? Math.max(...dealers.map((dealer) => Number(dealer.id))) + 1
    : 101;

  const newDealer = {
    id: nextId,
    role: "DEALER",
    status: "ACTIVE",
    salesCount: 0,
    responseStatus: "문의 가능",
    profileImageUrl: "/images/dealers/dealer1.jpg",
    createdAt: new Date().toISOString().slice(0, 10),
    careerStartDate: new Date().toISOString().slice(0, 10),
    ...dealerData,
  };

  const nextDealers = [...dealers, newDealer];
  localStorage.setItem(COMPANY_DEALERS_KEY, JSON.stringify(nextDealers));
  window.dispatchEvent(new Event("companyDealerChange"));

  return newDealer;
}

export function updateCompanyDealerStatus(dealerId, status) {
  const nextDealers = getCompanyDealers().map((dealer) =>
    Number(dealer.id) === Number(dealerId)
      ? { ...dealer, status }
      : dealer
  );

  localStorage.setItem(COMPANY_DEALERS_KEY, JSON.stringify(nextDealers));
  window.dispatchEvent(new Event("companyDealerChange"));

  return nextDealers;
}

export function getCompanyDealerById(dealerId) {
  return getCompanyDealers().find((dealer) => Number(dealer.id) === Number(dealerId));
}

export function updateCompanyDealerProfile(dealerId, profileData) {
  const nextDealers = getCompanyDealers().map((dealer) =>
    Number(dealer.id) === Number(dealerId)
      ? { ...dealer, ...profileData, updatedAt: new Date().toISOString().slice(0, 10) }
      : dealer
  );
  localStorage.setItem(COMPANY_DEALERS_KEY, JSON.stringify(nextDealers));
  window.dispatchEvent(new Event("companyDealerChange"));
  return nextDealers.find((dealer) => Number(dealer.id) === Number(dealerId));
}
