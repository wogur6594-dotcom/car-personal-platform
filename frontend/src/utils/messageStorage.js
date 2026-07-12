const MESSAGE_ROOM_KEY = "autoCareMessageRooms";

export const getMessageRooms = () => {
  const savedRooms = localStorage.getItem(MESSAGE_ROOM_KEY);

  if (!savedRooms) {
    return [];
  }

  try {
    return JSON.parse(savedRooms);
  } catch (error) {
    return [];
  }
};

export const saveMessageRooms = (rooms) => {
  localStorage.setItem(MESSAGE_ROOM_KEY, JSON.stringify(rooms));
};

export const findMessageRoom = ({ carId, receiverType, receiverId }) => {
  const rooms = getMessageRooms();

  return rooms.find(
    (room) =>
      String(room.carId) === String(carId) &&
      String(room.receiverType) === String(receiverType) &&
      String(room.receiverId) === String(receiverId)
  );
};

export const createOrGetMessageRoom = ({
  car,
  receiverType,
  receiverId,
  receiverName,
}) => {
  const rooms = getMessageRooms();

  const existRoom = rooms.find(
    (room) =>
      String(room.carId) === String(car.id) &&
      String(room.receiverType) === String(receiverType) &&
      String(room.receiverId) === String(receiverId)
  );

  if (existRoom) {
    return existRoom;
  }

  const newRoom = {
    id: `room-${car.id}-${receiverType}-${receiverId}`,
    carId: car.id,
    carTitle: car.title,
    carImageUrl: car.imageUrl,
    receiverType,
    receiverId,
    receiverName,
    lastMessage: "차량 문의 채팅방이 생성되었습니다.",
    lastMessageTime: new Date().toISOString(),
    unreadCount: 0,
    messages: [
      {
        id: Date.now(),
        sender: "system",
        text: `${car.title} 매물 문의 채팅방입니다.`,
        createdAt: new Date().toISOString(),
      },
    ],
  };

  const nextRooms = [newRoom, ...rooms];
  saveMessageRooms(nextRooms);

  return newRoom;
};

export const addMessageToRoom = (roomId, messageText) => {
  const rooms = getMessageRooms();

  const nextRooms = rooms.map((room) => {
    if (room.id !== roomId) {
      return room;
    }

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: messageText,
      createdAt: new Date().toISOString(),
    };

    return {
      ...room,
      lastMessage: messageText,
      lastMessageTime: newMessage.createdAt,
      messages: [...room.messages, newMessage],
    };
  });

  saveMessageRooms(nextRooms);

  return nextRooms.find((room) => room.id === roomId);
};

export const getMessageRoomById = (roomId) => {
  const rooms = getMessageRooms();

  return rooms.find((room) => room.id === roomId);
};