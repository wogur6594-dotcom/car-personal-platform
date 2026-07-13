import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import {
  getCarById,
  updateCar,
} from "../../utils/carStorage";
import {
  getLoginUser,
} from "../../utils/authStorage";
import "../../css/car/usedCarRegisterPage.css";

const MAX_IMAGE_COUNT = 6;
const MAX_IMAGE_SIZE = 1024 * 1024;

const BRAND_OPTIONS = [
  "현대",
  "기아",
  "제네시스",
  "쉐보레",
  "르노코리아",
  "KG모빌리티",
  "BMW",
  "벤츠",
  "아우디",
  "폭스바겐",
  "볼보",
  "렉서스",
  "테슬라",
  "기타",
];

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

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(
        new Error(
          "이미지를 읽는 중 오류가 발생했습니다."
        )
      );
    };

    reader.readAsDataURL(file);
  });
}

function UsedCarEditPage() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const imageInputRef = useRef(null);

  const loginUser = getLoginUser();
  const car = getCarById(carId);

  const [form, setForm] = useState({
    title: "",
    brand: "",
    model: "",
    price: "",
    year: "",
    mileage: "",
    region: "",
    exteriorColor: "",
    interiorColor: "",
    transmission: "오토",
    fuelType: "가솔린",
    carType: "중형",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const isOwner =
    loginUser &&
    car &&
    Number(loginUser.id) ===
      Number(car.sellerId) &&
    loginUser.role === car.sellerType;

  useEffect(() => {
    if (!car) {
      return;
    }

    setForm({
      title: car.title || "",
      brand: car.brand || "",
      model: car.model || "",
      price: car.price || "",
      year: car.year || "",
      mileage: car.mileage || "",
      region: car.region || "",
      exteriorColor:
        car.exteriorColor || "",
      interiorColor:
        car.interiorColor || "",
      transmission:
        car.transmission || "오토",
      fuelType:
        car.fuelType || "가솔린",
      carType:
        car.carType || "중형",
      description:
        car.description || "",
    });

    const savedImageUrls =
      Array.isArray(car.imageUrls) &&
      car.imageUrls.length > 0
        ? car.imageUrls
        : car.imageUrl
          ? [car.imageUrl]
          : [];

    setImages(
      savedImageUrls.map(
        (imageUrl, index) => ({
          id: `saved-${index}-${imageUrl}`,
          name: `기존 이미지 ${index + 1}`,
          url: imageUrl,
          isSaved: true,
        })
      )
    );
  }, [carId]);

  if (!car) {
    return (
      <main className="page">
        <PageTitle
          title="차량을 찾을 수 없습니다."
          description="존재하지 않거나 삭제된 차량입니다."
        >
          <Link
            to="/cars"
            className="outline-btn"
          >
            차량 목록으로
          </Link>
        </PageTitle>
      </main>
    );
  }

  if (!isOwner) {
    return (
      <Navigate
        to="/forbidden"
        replace
      />
    );
  }

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleImageChange = async (
    event
  ) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    event.target.value = "";

    if (selectedFiles.length === 0) {
      return;
    }

    const remainingCount =
      MAX_IMAGE_COUNT - images.length;

    if (remainingCount <= 0) {
      setErrorMessage(
        `이미지는 최대 ${MAX_IMAGE_COUNT}장까지 등록할 수 있습니다.`
      );

      return;
    }

    const limitedFiles =
      selectedFiles.slice(
        0,
        remainingCount
      );

    const invalidFile =
      limitedFiles.find(
        (file) =>
          !file.type.startsWith(
            "image/"
          )
      );

    if (invalidFile) {
      setErrorMessage(
        "이미지 파일만 등록할 수 있습니다."
      );

      return;
    }

    const oversizedFile =
      limitedFiles.find(
        (file) =>
          file.size > MAX_IMAGE_SIZE
      );

    if (oversizedFile) {
      setErrorMessage(
        `"${oversizedFile.name}" 파일은 1MB를 초과합니다.`
      );

      return;
    }

    try {
      const convertedImages =
        await Promise.all(
          limitedFiles.map(
            async (file) => ({
              id:
                `${file.name}-` +
                `${file.size}-` +
                `${Date.now()}-` +
                `${Math.random()}`,
              name: file.name,
              url:
                await readImageFile(
                  file
                ),
              isSaved: false,
            })
          )
        );

      setImages((prevImages) => [
        ...prevImages,
        ...convertedImages,
      ]);

      setErrorMessage("");
    } catch (error) {
      console.error(
        "차량 이미지 변환 오류:",
        error
      );

      setErrorMessage(
        "이미지를 불러오지 못했습니다."
      );
    }
  };

  const handleRemoveImage = (
    imageId
  ) => {
    setImages((prevImages) =>
      prevImages.filter(
        (image) =>
          image.id !== imageId
      )
    );
  };

  const handleSetMainImage = (
    imageId
  ) => {
    setImages((prevImages) => {
      const targetImage =
        prevImages.find(
          (image) =>
            image.id === imageId
        );

      if (!targetImage) {
        return prevImages;
      }

      return [
        targetImage,
        ...prevImages.filter(
          (image) =>
            image.id !== imageId
        ),
      ];
    });
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      return "차량 제목을 입력해주세요.";
    }

    if (!form.brand) {
      return "브랜드를 선택해주세요.";
    }

    if (!form.model.trim()) {
      return "모델명을 입력해주세요.";
    }

    if (
      !form.price ||
      Number(form.price) <= 0
    ) {
      return "판매가를 입력해주세요.";
    }

    if (
      !form.year ||
      Number(form.year) < 1900
    ) {
      return "올바른 연식을 입력해주세요.";
    }

    if (
      form.mileage === "" ||
      Number(form.mileage) < 0
    ) {
      return "주행거리를 입력해주세요.";
    }

    if (!form.region) {
      return "판매 지역을 선택해주세요.";
    }

    if (!form.description.trim()) {
      return "차량 설명을 입력해주세요.";
    }

    if (images.length === 0) {
      return "차량 이미지를 한 장 이상 등록해주세요.";
    }

    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationMessage =
      validateForm();

    if (validationMessage) {
      setErrorMessage(
        validationMessage
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrls =
        images.map(
          (image) => image.url
        );

      const updatedCar = updateCar(
        car.id,
        {
          ...form,
          title: form.title.trim(),
          model: form.model.trim(),
          price: Number(form.price),
          year: Number(form.year),
          mileage: Number(
            form.mileage
          ),
          exteriorColor:
            form.exteriorColor.trim() ||
            "미입력",
          interiorColor:
            form.interiorColor.trim() ||
            "미입력",
          description:
            form.description.trim(),
          imageUrls,
          imageUrl: imageUrls[0],
        }
      );

      if (!updatedCar) {
        setErrorMessage(
          "차량 정보 수정에 실패했습니다."
        );

        setIsSubmitting(false);

        return;
      }

      navigate(
        `/cars/${updatedCar.id}`,
        {
          replace: true,
          state: {
            message:
              "차량 정보가 수정되었습니다.",
          },
        }
      );
    } catch (error) {
      console.error(
        "차량 수정 오류:",
        error
      );

      setErrorMessage(
        "차량 수정 중 오류가 발생했습니다."
      );

      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      <PageTitle
        title="차량 정보 수정"
        description="등록한 차량의 정보를 수정합니다."
      >
        <Link
          to={`/cars/${car.id}`}
          className="outline-btn"
        >
          차량 상세로
        </Link>
      </PageTitle>

      <form
        className="register-form"
        onSubmit={handleSubmit}
      >
        <label>
          차량 제목 *

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="예: 현대 아반떼 CN7 1.6"
          />
        </label>

        <div className="form-grid-2">
          <label>
            브랜드 *

            <select
              name="brand"
              value={form.brand}
              onChange={handleChange}
            >
              <option value="">
                브랜드 선택
              </option>

              {BRAND_OPTIONS.map(
                (brand) => (
                  <option
                    key={brand}
                    value={brand}
                  >
                    {brand}
                  </option>
                )
              )}
            </select>
          </label>

          <label>
            모델명 *

            <input
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="아반떼"
            />
          </label>
        </div>

        <div className="form-grid-2">
          <label>
            연식 *

            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              min="1900"
              max={
                new Date().getFullYear() +
                1
              }
              placeholder="2022"
            />
          </label>

          <label>
            주행거리 *

            <input
              type="number"
              name="mileage"
              value={form.mileage}
              onChange={handleChange}
              min="0"
              placeholder="28000"
            />
          </label>
        </div>

        <div className="form-grid-2">
          <label>
            판매가 (만원) *

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="1"
              max="200000"
              placeholder="예: 1980"
            />
          </label>

          <label>
            지역 *

            <select
              name="region"
              value={form.region}
              onChange={handleChange}
            >
              <option value="">
                지역 선택
              </option>

              {REGION_OPTIONS.map(
                (region) => (
                  <option
                    key={region}
                    value={region}
                  >
                    {region}
                  </option>
                )
              )}
            </select>
          </label>
        </div>

        <div className="form-grid-2">
          <label>
            차량 종류

            <select
              name="carType"
              value={form.carType}
              onChange={handleChange}
            >
              <option value="경형">
                경형
              </option>

              <option value="소형">
                소형
              </option>

              <option value="준중형">
                준중형
              </option>

              <option value="중형">
                중형
              </option>

              <option value="대형">
                대형
              </option>

              <option value="SUV">
                SUV
              </option>

              <option value="RV">
                RV
              </option>

              <option value="승합">
                승합
              </option>

              <option value="화물">
                화물
              </option>
            </select>
          </label>

          <label>
            연료

            <select
              name="fuelType"
              value={form.fuelType}
              onChange={handleChange}
            >
              <option value="가솔린">
                가솔린
              </option>

              <option value="디젤">
                디젤
              </option>

              <option value="LPG">
                LPG
              </option>

              <option value="하이브리드">
                하이브리드
              </option>

              <option value="전기">
                전기
              </option>

              <option value="수소">
                수소
              </option>
            </select>
          </label>
        </div>

        <div className="form-grid-2">
          <label>
            변속기

            <select
              name="transmission"
              value={form.transmission}
              onChange={handleChange}
            >
              <option value="오토">
                오토
              </option>

              <option value="수동">
                수동
              </option>

              <option value="CVT">
                CVT
              </option>

              <option value="DCT">
                DCT
              </option>
            </select>
          </label>

          <label>
            외장 색상

            <input
              name="exteriorColor"
              value={
                form.exteriorColor
              }
              onChange={handleChange}
              placeholder="예: 흰색"
            />
          </label>
        </div>

        <label>
          내장 색상

          <input
            name="interiorColor"
            value={
              form.interiorColor
            }
            onChange={handleChange}
            placeholder="예: 검정"
          />
        </label>

        <label>
          차량 설명 *

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="7"
            placeholder="차량 상태, 사고 이력, 정비 내역 등을 입력"
          />
        </label>

        <div className="car-image-upload-box">
          <div className="car-image-upload-header">
            <div>
              <strong>
                차량 이미지 *
              </strong>

              <p>
                최대 {MAX_IMAGE_COUNT}장,
                이미지당 1MB 이하
              </p>
            </div>

            <button
              type="button"
              className="outline-btn"
              onClick={() =>
                imageInputRef.current?.click()
              }
            >
              이미지 추가
            </button>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={
                handleImageChange
              }
            />
          </div>

          {images.length > 0 && (
            <div className="car-image-preview-list">
              {images.map(
                (image, index) => (
                  <div
                    key={image.id}
                    className="car-image-preview-item"
                  >
                    <img
                      src={image.url}
                      alt={`차량 이미지 ${
                        index + 1
                      }`}
                    />

                    {index === 0 ? (
                      <span>
                        대표 이미지
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="car-main-image-btn"
                        onClick={() =>
                          handleSetMainImage(
                            image.id
                          )
                        }
                      >
                        대표
                      </button>
                    )}

                    <button
                      type="button"
                      className="car-image-remove-btn"
                      onClick={() =>
                        handleRemoveImage(
                          image.id
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {errorMessage && (
          <p className="car-register-error">
            {errorMessage}
          </p>
        )}

        <div className="car-register-actions">
          <button
            type="button"
            className="outline-btn"
            onClick={() =>
              navigate(-1)
            }
          >
            취소
          </button>

          <button
            type="submit"
            className="primary-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "수정 중..."
              : "수정 완료"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default UsedCarEditPage;