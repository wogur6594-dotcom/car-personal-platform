const MESSAGE_ROOM_KEY = "autoCareMessageRooms";
const MESSAGE_CHANGE_EVENT = "messageStorageChange";

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

function dispatchMessageChange() {
  window.dispatchEvent(new Event(MESSAGE_CHANGE_EVENT));
}

function parseRooms(savedRooms) {
  if (!savedRooms) {
    return [];
  }

  try {
    const parsedRooms = JSON.parse(savedRooms);

    return Array.isArray(parsedRooms)
      ? parsedRooms
      : [];
  } catch (error) {
    console.error("채팅방 데이터 변환 오류:", error);
    return [];
  }
}

/**
 * 전체 채팅방 조회
 */
export function getMessageRooms() {
  const savedRooms =
    localStorage.getItem(MESSAGE_ROOM_KEY);

  return parseRooms(savedRooms);
}

/**
 * 전체 채팅방 저장
 */
export function saveMessageRooms(rooms) {
  try {
    localStorage.setItem(
      MESSAGE_ROOM_KEY,
      JSON.stringify(rooms)
    );

    dispatchMessageChange();

    return true;
  } catch (error) {
    console.error("채팅방 저장 오류:", error);

    if (
      error.name === "QuotaExceededError" ||
      error.code === 22
    ) {
      alert(
        "브라우저 저장 공간이 부족합니다. 이미지 크기나 개수를 줄여주세요."
      );
    }

    return false;
  }
}

/**
 * 최근 메시지순 채팅방 조회
 */
export function getSortedMessageRooms() {
  return [...getMessageRooms()].sort((a, b) => {
    return (
      new Date(b.lastMessageTime).getTime() -
      new Date(a.lastMessageTime).getTime()
    );
  });
}

/**
 * 채팅방 ID로 조회
 */
export function getMessageRoomById(roomId) {
  const rooms = getMessageRooms();

  return (
    rooms.find(
      (room) =>
        String(room.id) === String(roomId)
    ) || null
  );
}

/**
 * 차량, 상대방, 문의자 기준 기존 채팅방 조회
 */
export function findMessageRoom({
  carId,
  receiverType,
  receiverId,
  senderId,
}) {
  const rooms = getMessageRooms();

  return (
    rooms.find(
      (room) =>
        String(room.carId) === String(carId) &&
        String(room.receiverType) ===
          String(receiverType) &&
        String(room.receiverId) ===
          String(receiverId) &&
        (
          senderId === undefined ||
          String(room.senderId) ===
            String(senderId)
        )
    ) || null
  );
}

/**
 * 기존 채팅방 반환 또는 새 채팅방 생성
 */
export function createOrGetMessageRoom({
  car,
  receiverType,
  receiverId,
  receiverName,
  senderId = "mock-member-1",
  senderName = "현재 회원",
}) {
  const rooms = getMessageRooms();

  const existingRoom = rooms.find(
    (room) =>
      String(room.carId) === String(car.id) &&
      String(room.receiverType) ===
        String(receiverType) &&
      String(room.receiverId) ===
        String(receiverId) &&
      String(
        room.senderId || "mock-member-1"
      ) === String(senderId)
  );

  if (existingRoom) {
    return existingRoom;
  }

  const createdAt = new Date().toISOString();

  const systemMessage = {
    id: createId("message"),
    type: "SYSTEM",
    sender: "system",
    senderType: "SYSTEM",
    senderId: null,
    senderName: "시스템",
    text: `${car.title} 매물 문의 채팅방입니다.`,
    images: [],
    createdAt,
  };

  const newRoom = {
    id: createId("room"),

    carId: car.id,
    carTitle: car.title,
    carImageUrl:
      car.imageUrl ||
      car.image ||
      car.thumbnailUrl ||
      "",
    carPrice: car.price,

    senderId,
    senderName,

    receiverType,
    receiverId,
    receiverName,

    lastMessage: systemMessage.text,
    lastMessageType: "SYSTEM",
    lastMessageTime: createdAt,

    unreadCount: 0,
    createdAt,
    messages: [systemMessage],
  };

  const nextRooms = [newRoom, ...rooms];

  saveMessageRooms(nextRooms);

  return newRoom;
}

/**
 * 텍스트 메시지 전송
 */
export function addTextMessageToRoom({
  roomId,
  text,
  senderType = "MEMBER",
  senderId = "mock-member-1",
  senderName = "현재 회원",
}) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return null;
  }

  const message = {
    id: createId("message"),
    type: "TEXT",
    sender: "me",
    senderType,
    senderId,
    senderName,
    text: trimmedText,
    images: [],
    createdAt: new Date().toISOString(),
  };

  return addMessageToRoom({
    roomId,
    message,
  });
}

/**
 * 이미지 메시지 전송
 */
export function addImageMessageToRoom({
  roomId,
  images,
  text = "",
  senderType = "MEMBER",
  senderId = "mock-member-1",
  senderName = "현재 회원",
}) {
  if (
    !Array.isArray(images) ||
    images.length === 0
  ) {
    return null;
  }

  const message = {
    id: createId("message"),
    type: "IMAGE",
    sender: "me",
    senderType,
    senderId,
    senderName,
    text: text.trim(),
    images,
    createdAt: new Date().toISOString(),
  };

  return addMessageToRoom({
    roomId,
    message,
  });
}

/**
 * 메시지 공통 저장
 */
export function addMessageToRoom({
  roomId,
  message,
}) {
  const rooms = getMessageRooms();

  let updatedRoom = null;

  const lastMessage =
    message.type === "IMAGE"
      ? message.images.length > 1
        ? `사진 ${message.images.length}장을 보냈습니다.`
        : "사진을 보냈습니다."
      : message.text;

  const nextRooms = rooms.map((room) => {
    if (
      String(room.id) !== String(roomId)
    ) {
      return room;
    }

    updatedRoom = {
      ...room,
      lastMessage,
      lastMessageType: message.type,
      lastMessageTime: message.createdAt,
      messages: [
        ...(room.messages || []),
        message,
      ],
    };

    return updatedRoom;
  });

  if (!updatedRoom) {
    return null;
  }

  nextRooms.sort((a, b) => {
    return (
      new Date(b.lastMessageTime).getTime() -
      new Date(a.lastMessageTime).getTime()
    );
  });

  const saved = saveMessageRooms(nextRooms);

  return saved ? updatedRoom : null;
}

/**
 * 상대방 응답 테스트용
 */
export function addMockReceiverMessage(
  roomId,
  text
) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return null;
  }

  const room = getMessageRoomById(roomId);

  if (!room) {
    return null;
  }

  const rooms = getMessageRooms();
  const createdAt = new Date().toISOString();

  const newMessage = {
    id: createId("message"),
    type: "TEXT",
    sender: "other",
    senderType: room.receiverType,
    senderId: room.receiverId,
    senderName: room.receiverName,
    text: trimmedText,
    images: [],
    createdAt,
  };

  let updatedRoom = null;

  const nextRooms = rooms.map((item) => {
    if (
      String(item.id) !== String(roomId)
    ) {
      return item;
    }

    updatedRoom = {
      ...item,
      lastMessage: trimmedText,
      lastMessageType: "TEXT",
      lastMessageTime: createdAt,
      unreadCount:
        Number(item.unreadCount || 0) + 1,
      messages: [
        ...(item.messages || []),
        newMessage,
      ],
    };

    return updatedRoom;
  });

  nextRooms.sort((a, b) => {
    return (
      new Date(b.lastMessageTime).getTime() -
      new Date(a.lastMessageTime).getTime()
    );
  });

  const saved = saveMessageRooms(nextRooms);

  return saved ? updatedRoom : null;
}

/**
 * 채팅방 읽음 처리
 */
export function markMessageRoomAsRead(
  roomId
) {
  const rooms = getMessageRooms();

  const targetRoom = rooms.find(
    (room) =>
      String(room.id) === String(roomId)
  );

  if (!targetRoom) {
    return null;
  }

  if (
    Number(targetRoom.unreadCount || 0) === 0
  ) {
    return targetRoom;
  }

  let updatedRoom = null;

  const nextRooms = rooms.map((room) => {
    if (
      String(room.id) !== String(roomId)
    ) {
      return room;
    }

    updatedRoom = {
      ...room,
      unreadCount: 0,
    };

    return updatedRoom;
  });

  saveMessageRooms(nextRooms);

  return updatedRoom;
}

/**
 * 전체 안 읽은 메시지 수
 */
export function getTotalUnreadMessageCount() {
  return getMessageRooms().reduce(
    (total, room) => {
      return (
        total +
        Number(room.unreadCount || 0)
      );
    },
    0
  );
}

/**
 * 채팅방 삭제
 */
export function deleteMessageRoom(roomId) {
  const rooms = getMessageRooms();

  const nextRooms = rooms.filter(
    (room) =>
      String(room.id) !== String(roomId)
  );

  saveMessageRooms(nextRooms);
}

/**
 * 메시지 변경 이벤트 이름 반환
 */
export function getMessageChangeEventName() {
  return MESSAGE_CHANGE_EVENT;
}

/**
 * 목업 채팅 데이터 전체 삭제
 */
export function clearMessageRooms() {
  localStorage.removeItem(MESSAGE_ROOM_KEY);
  dispatchMessageChange();
}