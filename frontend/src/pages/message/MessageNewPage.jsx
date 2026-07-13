import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  getCarById,
} from "../../utils/carStorage";
import {
  getLoginUser,
} from "../../utils/authStorage";
import {
  addImageMessageToRoom,
  addTextMessageToRoom,
  createOrGetMessageRoom,
  getMessageChangeEventName,
  getMessageRoomById,
  markMessageRoomAsRead,
} from "../../utils/messageStorage";
import "../../css/message/messageNewPage.css";

const MAX_IMAGE_COUNT = 6;
const MAX_IMAGE_SIZE = 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

function MessageNewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewGallery, setPreviewGallery] = useState(null);
  const [isImageReading, setIsImageReading] = useState(false);

  const messageEndRef = useRef(null);
  const imageInputRef = useRef(null);

  const roomId = searchParams.get("roomId");
  const carId = searchParams.get("carId");
  const receiverType = searchParams.get("receiverType");
  const receiverId = searchParams.get("receiverId");

  const loginUser = getLoginUser();

  const currentUser = {
    id: loginUser?.id,
    name:
      loginUser?.name ||
      "로그인 사용자",
    role:
      loginUser?.role ||
      "MEMBER",
  };

  useEffect(() => {
    if (roomId) {
      const savedRoom = getMessageRoomById(roomId);

      if (!savedRoom) {
        setRoom(null);
        return;
      }

      const readableRoom =
        markMessageRoomAsRead(savedRoom.id) || savedRoom;

      setRoom(readableRoom);
      return;
    }

    const car = getCarById(carId);

    if (!car) {
      setRoom(null);
      return;
    }

    const targetReceiverType =
      receiverType || car.sellerType || "MEMBER";

    const targetReceiverId =
      receiverId ||
      car.dealerId ||
      car.sellerId;

    const targetReceiverName =
      targetReceiverType === "DEALER" ||
        targetReceiverType === "딜러"
        ? car.dealerName || car.sellerName
        : car.sellerName;

    if (!targetReceiverId || !targetReceiverName) {
      setRoom(null);
      return;
    }

    const createdRoom = createOrGetMessageRoom({
      car,
      receiverType: targetReceiverType,
      receiverId: targetReceiverId,
      receiverName: targetReceiverName,
      senderId: currentUser.id,
      senderName: currentUser.name,
    });

    setRoom(createdRoom);

    navigate(`/messages/new?roomId=${createdRoom.id}`, {
      replace: true,
    });
  }, [
    roomId,
    carId,
    receiverType,
    receiverId,
    navigate,
  ]);

  useEffect(() => {
    const eventName = getMessageChangeEventName();

    const handleMessageChange = () => {
      if (!room?.id) {
        return;
      }

      const updatedRoom = getMessageRoomById(room.id);

      if (!updatedRoom) {
        setRoom(null);
        return;
      }

      setRoom(updatedRoom);
    };

    window.addEventListener(
      eventName,
      handleMessageChange
    );

    window.addEventListener(
      "storage",
      handleMessageChange
    );

    return () => {
      window.removeEventListener(
        eventName,
        handleMessageChange
      );

      window.removeEventListener(
        "storage",
        handleMessageChange
      );
    };
  }, [room?.id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [room?.messages]);

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    const files = Array.from(
      event.target.files || []
    );

    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    const remainingCount =
      MAX_IMAGE_COUNT - selectedImages.length;

    if (remainingCount <= 0) {
      alert(
        `이미지는 한 번에 최대 ${MAX_IMAGE_COUNT}장까지 전송할 수 있습니다.`
      );
      return;
    }

    const limitedFiles = files.slice(
      0,
      remainingCount
    );

    if (files.length > remainingCount) {
      alert(
        `이미지는 한 번에 최대 ${MAX_IMAGE_COUNT}장까지 선택할 수 있습니다.`
      );
    }

    const invalidTypeFile = limitedFiles.find(
      (file) =>
        !ACCEPTED_IMAGE_TYPES.includes(file.type)
    );

    if (invalidTypeFile) {
      alert(
        "JPG, PNG, WEBP, GIF 이미지 파일만 전송할 수 있습니다."
      );
      return;
    }

    const oversizedFile = limitedFiles.find(
      (file) => file.size > MAX_IMAGE_SIZE
    );

    if (oversizedFile) {
      alert(
        `"${oversizedFile.name}" 파일의 크기가 1MB를 초과합니다.`
      );
      return;
    }

    setIsImageReading(true);

    try {
      const convertedImages = await Promise.all(
        limitedFiles.map(convertImageFile)
      );

      setSelectedImages((prevImages) => [
        ...prevImages,
        ...convertedImages,
      ]);
    } catch (error) {
      console.error("이미지 변환 오류:", error);
      alert("이미지를 불러오지 못했습니다.");
    } finally {
      setIsImageReading(false);
    }
  };

  const handleRemoveSelectedImage = (
    imageId
  ) => {
    setSelectedImages((prevImages) =>
      prevImages.filter(
        (image) => image.id !== imageId
      )
    );
  };

  const handleClearSelectedImages = () => {
    setSelectedImages([]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!room || isImageReading) {
      return;
    }

    const trimmedText = messageText.trim();
    const hasImages =
      selectedImages.length > 0;

    if (!trimmedText && !hasImages) {
      return;
    }

    let updatedRoom = null;

    if (hasImages) {
      updatedRoom = addImageMessageToRoom({
        roomId: room.id,
        images: selectedImages,
        text: trimmedText,
        senderType: currentUser.role,
        senderId: currentUser.id,
        senderName: currentUser.name,
      });
    } else {
      updatedRoom = addTextMessageToRoom({
        roomId: room.id,
        text: trimmedText,
        senderType: currentUser.role,
        senderId: currentUser.id,
        senderName: currentUser.name,
      });
    }

    if (!updatedRoom) {
      return;
    }

    setRoom(updatedRoom);
    setMessageText("");
    setSelectedImages([]);
  };

  const handleKeyDown = (event) => {
    if (
      event.key !== "Enter" ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    handleSubmit(event);
  };

  if (!room) {
    return (
      <main className="page message-page">
        <div className="message-not-found">
          <h1>채팅방을 찾을 수 없습니다.</h1>

          <p>
            차량 정보가 없거나 삭제된
            채팅방입니다.
          </p>

          <Link
            to="/cars"
            className="primary-btn"
          >
            중고차 목록으로
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page message-page">
      <section className="dm-layout">
        <aside className="dm-left-panel">
          <div className="dm-profile-box">
            <div className="dm-car-image">
              <img
                src={room.carImageUrl}
                alt={room.carTitle}
                onError={(event) => {
                  event.currentTarget.src =
                    "/images/cars/default-car.jpg";
                }}
              />
            </div>

            <div>
              <h2>{room.receiverName}</h2>

              <p>
                {getReceiverTypeName(
                  room.receiverType
                )}
              </p>
            </div>
          </div>

          <div className="dm-car-box">
            <span>문의 차량</span>

            <strong>{room.carTitle}</strong>

            {room.carPrice && (
              <p className="dm-car-price">
                {Number(
                  room.carPrice
                ).toLocaleString()}
                만원
              </p>
            )}

            <Link to={`/cars/${room.carId}`}>
              차량 상세 보기
            </Link>
          </div>
        </aside>

        <section className="dm-chat-panel">
          <div className="dm-chat-header">
            <div>
              <strong>
                {room.receiverName}
              </strong>

              <span>차량 문의 메세지</span>
            </div>

            <Link
              to="/cars"
              className="outline-btn"
            >
              목록으로
            </Link>
          </div>

          <div className="dm-message-list">
            {(room.messages || []).map(
              (message, index) => {
                const isSystemMessage =
                  message.type === "SYSTEM" ||
                  message.sender === "system" ||
                  message.senderType === "SYSTEM";

                const isMyMessage =
                  !isSystemMessage &&
                  (
                    message.sender === "me" ||
                    String(message.senderId) ===
                    String(currentUser.id)
                  );

                const nextMessage =
                  room.messages[index + 1];

                const showTime =
                  shouldShowMessageTime(
                    message,
                    nextMessage
                  );

                if (isSystemMessage) {
                  return (
                    <div
                      key={message.id}
                      className="dm-system-message"
                    >
                      <span>{message.text}</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={message.id}
                    className={
                      isMyMessage
                        ? "dm-message-row my-message"
                        : "dm-message-row other-message"
                    }
                  >
                    <div className="dm-message-content">
                      {!isMyMessage && (
                        <span className="dm-message-sender">
                          {message.senderName ||
                            room.receiverName}
                        </span>
                      )}

                      <div className="dm-message-bubble">
                        {Array.isArray(
                          message.images
                        ) &&
                          message.images.length >
                          0 && (
                            <MessageImageGallery
                              images={
                                message.images
                              }
                              onImageClick={(
                                imageIndex
                              ) => {
                                setPreviewGallery({
                                  images:
                                    message.images,
                                  currentIndex:
                                    imageIndex,
                                });
                              }}
                            />
                          )}

                        {message.text && (
                          <p className="dm-message-text">
                            {message.text}
                          </p>
                        )}

                        {showTime && (
                          <span className="dm-message-time">
                            {formatMessageTime(
                              message.createdAt
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            )}

            <div ref={messageEndRef}></div>
          </div>

          {selectedImages.length > 0 && (
            <div className="dm-selected-image-area">
              <div className="dm-selected-image-header">
                <strong>
                  이미지 {selectedImages.length}장
                  선택
                </strong>

                <button
                  type="button"
                  onClick={
                    handleClearSelectedImages
                  }
                >
                  전체 삭제
                </button>
              </div>

              <div className="dm-selected-image-list">
                {selectedImages.map(
                  (image) => (
                    <div
                      key={image.id}
                      className="dm-selected-image-item"
                    >
                      <img
                        src={getImageSource(
                          image
                        )}
                        alt={image.name}
                      />

                      <button
                        type="button"
                        aria-label={`${image.name} 삭제`}
                        onClick={() =>
                          handleRemoveSelectedImage(
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
            </div>
          )}

          <form
            className="dm-message-form"
            onSubmit={handleSubmit}
          >
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              hidden
              onChange={handleImageChange}
            />

            <button
              type="button"
              className="dm-image-upload-button"
              onClick={
                handleImageButtonClick
              }
              disabled={
                isImageReading ||
                selectedImages.length >=
                MAX_IMAGE_COUNT
              }
            >
              이미지
            </button>

            <textarea
              value={messageText}
              onChange={(event) =>
                setMessageText(
                  event.target.value
                )
              }
              onKeyDown={handleKeyDown}
              placeholder={
                selectedImages.length > 0
                  ? "이미지와 함께 보낼 메세지를 입력하세요."
                  : "메세지를 입력하세요."
              }
              rows={1}
              maxLength={1000}
            />

            <button
              type="submit"
              className="dm-send-button"
              disabled={
                isImageReading ||
                (
                  !messageText.trim() &&
                  selectedImages.length === 0
                )
              }
            >
              {isImageReading
                ? "처리 중"
                : "전송"}
            </button>
          </form>
        </section>
      </section>

      {previewGallery &&
        Array.isArray(
          previewGallery.images
        ) &&
        previewGallery.images.length > 0 && (
          <ImagePreviewModal
            images={previewGallery.images}
            currentIndex={
              previewGallery.currentIndex
            }
            onChangeIndex={(nextIndex) => {
              setPreviewGallery(
                (prevGallery) => {
                  if (!prevGallery) {
                    return null;
                  }

                  return {
                    ...prevGallery,
                    currentIndex: nextIndex,
                  };
                }
              );
            }}
            onClose={() =>
              setPreviewGallery(null)
            }
          />
        )}
    </main>
  );
}

function MessageImageGallery({
  images,
  onImageClick,
}) {
  if (
    !Array.isArray(images) ||
    images.length === 0
  ) {
    return null;
  }

  const visibleImages = images.slice(0, 4);
  const remainingCount =
    images.length - 4;

  const galleryClassName =
    getGalleryClassName(
      visibleImages.length
    );

  return (
    <div className={galleryClassName}>
      {visibleImages.map(
        (image, index) => {
          const imageSource =
            getImageSource(image);

          if (!imageSource) {
            return null;
          }

          return (
            <button
              key={
                image?.id ||
                image?.name ||
                `message-image-${index}`
              }
              type="button"
              className="dm-gallery-image-button"
              onClick={() =>
                onImageClick(index)
              }
            >
              <img
                src={imageSource}
                alt={
                  image?.name ||
                  `전송 이미지 ${index + 1
                  }`
                }
              />

              {index === 3 &&
                remainingCount > 0 && (
                  <span className="dm-gallery-more">
                    +{remainingCount}
                  </span>
                )}
            </button>
          );
        }
      )}
    </div>
  );
}

function ImagePreviewModal({
  images,
  currentIndex,
  onChangeIndex,
  onClose,
}) {
  const safeImages = Array.isArray(images)
    ? images
    : [];

  const safeIndex =
    Number.isInteger(currentIndex) &&
      currentIndex >= 0 &&
      currentIndex < safeImages.length
      ? currentIndex
      : 0;

  const currentImage =
    safeImages[safeIndex];

  const currentImageSource =
    getImageSource(currentImage);

  const hasPreviousImage =
    safeIndex > 0;

  const hasNextImage =
    safeIndex < safeImages.length - 1;

  useEffect(() => {
    const handleModalKeyDown = (
      event
    ) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (
        event.key === "ArrowLeft" &&
        hasPreviousImage
      ) {
        onChangeIndex(safeIndex - 1);
        return;
      }

      if (
        event.key === "ArrowRight" &&
        hasNextImage
      ) {
        onChangeIndex(safeIndex + 1);
      }
    };

    window.addEventListener(
      "keydown",
      handleModalKeyDown
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      window.removeEventListener(
        "keydown",
        handleModalKeyDown
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    safeIndex,
    hasPreviousImage,
    hasNextImage,
    onChangeIndex,
    onClose,
  ]);

  if (
    safeImages.length === 0 ||
    !currentImage ||
    !currentImageSource
  ) {
    return null;
  }

  const handlePrevious = () => {
    if (!hasPreviousImage) {
      return;
    }

    onChangeIndex(safeIndex - 1);
  };

  const handleNext = () => {
    if (!hasNextImage) {
      return;
    }

    onChangeIndex(safeIndex + 1);
  };

  return (
    <div
      className="dm-image-modal"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="dm-image-modal-content"
        role="dialog"
        aria-modal="true"
        aria-label="이미지 크게 보기"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="dm-image-modal-close"
          onClick={onClose}
          aria-label="이미지 닫기"
        >
          ×
        </button>

        {safeImages.length > 1 && (
          <div className="dm-image-modal-count">
            {safeIndex + 1} /{" "}
            {safeImages.length}
          </div>
        )}

        <button
          type="button"
          className="dm-image-modal-arrow dm-image-modal-prev"
          onClick={handlePrevious}
          disabled={!hasPreviousImage}
          aria-label="이전 이미지"
        >
          ‹
        </button>

        <div className="dm-image-modal-image-area">
          <img
            src={currentImageSource}
            alt={
              currentImage?.name ||
              `전송 이미지 ${safeIndex + 1
              }`
            }
          />
        </div>

        <button
          type="button"
          className="dm-image-modal-arrow dm-image-modal-next"
          onClick={handleNext}
          disabled={!hasNextImage}
          aria-label="다음 이미지"
        >
          ›
        </button>

        {currentImage?.name && (
          <p>{currentImage.name}</p>
        )}

        {safeImages.length > 1 && (
          <div className="dm-image-modal-thumbnail-list">
            {safeImages.map(
              (image, index) => {
                const thumbnailSource =
                  getImageSource(image);

                if (!thumbnailSource) {
                  return null;
                }

                return (
                  <button
                    key={
                      image?.id ||
                      image?.name ||
                      `thumbnail-${index}`
                    }
                    type="button"
                    className={
                      index === safeIndex
                        ? "dm-image-modal-thumbnail active"
                        : "dm-image-modal-thumbnail"
                    }
                    onClick={() =>
                      onChangeIndex(index)
                    }
                    aria-label={`${index + 1
                      }번째 이미지 보기`}
                  >
                    <img
                      src={thumbnailSource}
                      alt={
                        image?.name ||
                        `전송 이미지 ${index + 1
                        }`
                      }
                    />
                  </button>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function convertImageFile(file) {
  return new Promise(
    (resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve({
          id: `image-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: reader.result,
        });
      };

      reader.onerror = () => {
        reject(
          new Error(
            `${file.name} 변환 실패`
          )
        );
      };

      reader.readAsDataURL(file);
    }
  );
}

function getImageSource(image) {
  if (!image) {
    return "";
  }

  if (typeof image === "string") {
    return image;
  }

  return (
    image.dataUrl ||
    image.url ||
    image.imageUrl ||
    image.src ||
    ""
  );
}

function getGalleryClassName(
  imageCount
) {
  if (imageCount === 1) {
    return "dm-image-gallery image-count-1";
  }

  if (imageCount === 2) {
    return "dm-image-gallery image-count-2";
  }

  if (imageCount === 3) {
    return "dm-image-gallery image-count-3";
  }

  return "dm-image-gallery image-count-4";
}

function getReceiverTypeName(
  receiverType
) {
  if (
    receiverType === "DEALER" ||
    receiverType === "딜러"
  ) {
    return "회사소속 딜러";
  }

  if (
    receiverType === "COMPANY" ||
    receiverType === "회사"
  ) {
    return "회사";
  }

  return "개인판매자";
}

function shouldShowMessageTime(
  currentMessage,
  nextMessage
) {
  if (!nextMessage) {
    return true;
  }

  const nextIsSystemMessage =
    nextMessage.type === "SYSTEM" ||
    nextMessage.sender === "system" ||
    nextMessage.senderType === "SYSTEM";

  if (nextIsSystemMessage) {
    return true;
  }

  const currentSender =
    currentMessage.senderId ||
    currentMessage.sender;

  const nextSender =
    nextMessage.senderId ||
    nextMessage.sender;

  if (
    String(currentSender) !==
    String(nextSender)
  ) {
    return true;
  }

  const currentDate = new Date(
    currentMessage.createdAt
  );

  const nextDate = new Date(
    nextMessage.createdAt
  );

  const currentMinute = Math.floor(
    currentDate.getTime() / 60000
  );

  const nextMinute = Math.floor(
    nextDate.getTime() / 60000
  );

  return currentMinute !== nextMinute;
}

function formatMessageTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  return date.toLocaleTimeString(
    "ko-KR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export default MessageNewPage;