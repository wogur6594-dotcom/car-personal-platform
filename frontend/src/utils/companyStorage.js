import { companyDummyData } from "../data/companyDummyData";

const COMPANY_STORAGE_KEY = "companies";

function normalizeCompany(company) {
  return {
    ...company,
    id: Number(company.id),
    dealerCount: Number(company.dealerCount || 0),
    salesCount: Number(company.salesCount || 0),
    rating: Number(company.rating || 0),
  };
}

function saveCompanies(companies) {
  localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(companies));
  window.dispatchEvent(new Event("companyChange"));
}

export function getCompanies() {
  const savedCompanies = localStorage.getItem(COMPANY_STORAGE_KEY);

  if (!savedCompanies) {
    const initialCompanies = companyDummyData.map(normalizeCompany);
    saveCompanies(initialCompanies);
    return initialCompanies;
  }

  try {
    const parsedCompanies = JSON.parse(savedCompanies);

    if (!Array.isArray(parsedCompanies)) {
      throw new Error("회사 데이터가 배열이 아닙니다.");
    }

    return parsedCompanies.map(normalizeCompany);
  } catch (error) {
    console.error("회사 데이터 파싱 오류:", error);
    const initialCompanies = companyDummyData.map(normalizeCompany);
    saveCompanies(initialCompanies);
    return initialCompanies;
  }
}

export function getCompanyById(companyId) {
  return getCompanies().find(
    (company) => Number(company.id) === Number(companyId)
  );
}

export function updateCompany(companyId, companyData) {
  let updatedCompany = null;

  const nextCompanies = getCompanies().map((company) => {
    if (Number(company.id) !== Number(companyId)) {
      return company;
    }

    updatedCompany = normalizeCompany({
      ...company,
      region: companyData.region.trim(),
      address: companyData.address.trim(),
      phone: companyData.phone.trim(),
      introduction: companyData.introduction.trim(),
      profileImageUrl:
        companyData.profileImageUrl.trim() || company.profileImageUrl,
    });

    return updatedCompany;
  });

  if (!updatedCompany) {
    return null;
  }

  saveCompanies(nextCompanies);
  return updatedCompany;
}
