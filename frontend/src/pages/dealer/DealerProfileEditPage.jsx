import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { getLoginUser } from "../../utils/authStorage";
import {
  getCompanyDealerById,
  updateCompanyDealerProfile,
} from "../../utils/companyDealerStorage";
import "../../css/dealer/dealerProfileEditPage.css";

const REGION_OPTIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "대전",
  "광주",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

function DealerProfileEditPage() {
  const navigate = useNavigate();
  const loginUser = getLoginUser();
  const dealer = getCompanyDealerById(loginUser?.id);

  const [introduction, setIntroduction] = useState(
    dealer?.introduction || ""
  );

  const [region, setRegion] = useState(dealer?.region || "");

  const [profileImageUrl, setProfileImageUrl] = useState(
    dealer?.profileImageUrl || "/images/dealers/dealer1.jpg"
  );

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!dealer) {
      navigate("/forbidden", { replace: true });
    }
  }, [dealer, navigate]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("이미지 파일만 등록할 수 있습니다.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage("프로필 사진은 2MB 이하로 등록해주세요.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfileImageUrl(reader.result);
      setMessage("");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!region) {
      setMessage("활동 지역을 선택해주세요.");
      return;
    }

    updateCompanyDealerProfile(dealer.id, {
      introduction: introduction.trim(),
      region,
      profileImageUrl,
    });

    setMessage("프로필이 저장되었습니다.");
  };

  if (!dealer) {
    return null;
  }

  return (
    <main className="page dealer-profile-edit-page">
      <PageTitle
        title="딜러 프로필 관리"
        description="공개 페이지에 표시되는 사진, 활동 지역, 소개문구를 직접 관리합니다."
      />

      <form
        className="dealer-profile-edit-card"
        onSubmit={handleSubmit}
      >
        <section className="dealer-profile-edit-summary">
          <img
            src={profileImageUrl}
            alt={dealer.name}
          />

          <div>
            <h2>{dealer.name}</h2>

            <p>
              {dealer.companyName} · {dealer.position} · {dealer.job}
            </p>

            <label className="outline-btn">
              프로필 사진 변경

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>
          </div>
        </section>

        <div className="dealer-profile-edit-fields">
          <label className="dealer-profile-region-field">
            <span>활동 지역</span>

            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
            >
              <option value="">활동 지역 선택</option>

              {REGION_OPTIONS.map((regionOption) => (
                <option
                  key={regionOption}
                  value={regionOption}
                >
                  {regionOption}
                </option>
              ))}
            </select>

            <small>
              딜러 공개 페이지에 표시되는 주요 활동 지역입니다.
            </small>
          </label>

          <label className="dealer-profile-introduction-field">
            <span>소개문구</span>

            <textarea
              value={introduction}
              onChange={(event) =>
                setIntroduction(event.target.value)
              }
              maxLength="500"
              rows="8"
              placeholder="고객에게 보여줄 경력, 상담 방식, 차량 거래 원칙 등을 작성해주세요."
            />

            <small>{introduction.length} / 500자</small>
          </label>
        </div>

        {message && (
          <p className="dealer-profile-edit-message">
            {message}
          </p>
        )}

        <div className="dealer-profile-edit-actions">
          <button
            type="button"
            className="outline-btn"
            onClick={() =>
              navigate(`/dealers/${dealer.id}`)
            }
          >
            공개 페이지 보기
          </button>

          <button
            type="submit"
            className="primary-btn"
          >
            프로필 저장
          </button>
        </div>
      </form>
    </main>
  );
}

export default DealerProfileEditPage;