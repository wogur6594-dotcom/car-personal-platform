import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMessageRooms } from "../../utils/messageStorage";
import "../../css/message/messageDropdown.css";

function MessageDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [rooms, setRooms] = useState([]);

  const totalUnreadCount = rooms.reduce(
    (sum, room) => sum + Number(room.unreadCount || 0),
    0
  );

  const loadRooms = () => {
    const savedRooms = getMessageRooms();

    const sortedRooms = [...savedRooms].sort(
      (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    setRooms(sortedRooms);
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    loadRooms();

    const handleFocus = () => {
      loadRooms();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadRooms();
    }
  }, [isOpen]);

  return (
    <div className="message-dropdown-wrap">
      <button
        type="button"
        className="header-icon-link message-dropdown-btn"
        onClick={handleToggle}
      >
        메세지함
        {totalUnreadCount > 0 && (
          <span className="header-badge">{totalUnreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="message-dropdown-panel">
          <div className="message-dropdown-header">
            <strong>메세지함</strong>
            <span>{rooms.length}개</span>
          </div>

          {rooms.length > 0 ? (
            <div className="message-room-list">
              {rooms.map((room) => (
                <Link
                  key={room.id}
                  to={`/messages/new?roomId=${room.id}`}
                  className="message-room-item"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="message-room-image">
                    <img src={room.carImageUrl} alt={room.carTitle} />
                  </div>

                  <div className="message-room-info">
                    <div className="message-room-top">
                      <strong>{room.receiverName}</strong>
                      <span>{formatMessageTime(room.lastMessageTime)}</span>
                    </div>

                    <p className="message-room-car">{room.carTitle}</p>
                    <p className="message-room-last">{room.lastMessage}</p>
                  </div>

                  {room.unreadCount > 0 && (
                    <span className="message-room-unread">
                      {room.unreadCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="message-empty-box">
              아직 생성된 채팅방이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
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

export default MessageDropdown;