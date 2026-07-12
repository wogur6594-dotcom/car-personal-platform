import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { carDummyData } from "../../data/carDummyData";
import {
  addMessageToRoom,
  createOrGetMessageRoom,
  getMessageRoomById,
} from "../../utils/messageStorage";
import "../../css/message/messageNewPage.css";

function MessageNewPage() {
  const [searchParams] = useSearchParams();
  const [room, setRoom] = useState(null);
  const [messageText, setMessageText] = useState("");
  const messageEndRef = useRef(null);

  const roomId = searchParams.get("roomId");
  const carId = searchParams.get("carId");
  const receiverType = searchParams.get("receiverType");
  const receiverId = searchParams.get("receiverId");

  useEffect(() => {
    if (roomId) {
      const savedRoom = getMessageRoomById(roomId);
      setRoom(savedRoom);
      return;
    }

    const car = carDummyData.find((item) => item.id === Number(carId));

    if (!car) {
      setRoom(null);
      return;
    }

    const targetReceiverType = receiverType || car.sellerType;
    const targetReceiverId = receiverId || car.sellerId;

    const targetReceiverName =
      car.sellerType === "DEALER" || car.sellerType === "딜러"
        ? car.dealerName || car.sellerName
        : car.sellerName;

    const createdRoom = createOrGetMessageRoom({
      car,
      receiverType: targetReceiverType,
      receiverId: targetReceiverId,
      receiverName: targetReceiverName,
    });

    setRoom(createdRoom);
  }, [roomId, carId, receiverType, receiverId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedText = messageText.trim();

    if (!trimmedText || !room) {
      return;
    }

    const updatedRoom = addMessageToRoom(room.id, trimmedText);
    setRoom(updatedRoom);
    setMessageText("");
  };

  if (!room) {
    return (
      <main className="page message-page">
        <div className="message-not-found">
          <h1>채팅방을 찾을 수 없습니다.</h1>
          <p>차량 정보가 없거나 삭제된 채팅방입니다.</p>
          <Link to="/cars" className="primary-btn">
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
              <img src={room.carImageUrl} alt={room.carTitle} />
            </div>

            <div>
              <h2>{room.receiverName}</h2>
              <p>{room.receiverType}</p>
            </div>
          </div>

          <div className="dm-car-box">
            <span>문의 차량</span>
            <strong>{room.carTitle}</strong>
            <Link to={`/cars/${room.carId}`}>차량 상세 보기</Link>
          </div>
        </aside>

        <section className="dm-chat-panel">
          <div className="dm-chat-header">
            <div>
              <strong>{room.receiverName}</strong>
              <span>차량 문의 메세지</span>
            </div>

            <Link to="/cars" className="outline-btn">
              목록으로
            </Link>
          </div>

          <div className="dm-message-list">
            {room.messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.sender === "me"
                    ? "dm-message-row my-message"
                    : "dm-message-row other-message"
                }
              >
                <div className="dm-message-bubble">
                  <p>{message.text}</p>
                  <span>{formatMessageTime(message.createdAt)}</span>
                </div>
              </div>
            ))}

            <div ref={messageEndRef}></div>
          </div>

          <form className="dm-message-form" onSubmit={handleSubmit}>
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="메세지를 입력하세요."
            />

            <button type="submit">전송</button>
          </form>
        </section>
      </section>
    </main>
  );
}

function formatMessageTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default MessageNewPage;