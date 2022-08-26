import React, { useState } from 'react';

const ChatRoomContext = React.createContext();

function ChatRoomProvider({ children }) {
  const [chatRooms, setChatRooms] = useState({});

  const [newGroupChatInfo, setNewGroupChatInfo] = useState({
    groupChatName: '',
    groupChatPicture: '',
    participants: [],
  });

  const value = {
    chatRooms,
    setChatRooms,
    newGroupChatInfo,
    setNewGroupChatInfo,
  };

  return (
    <ChatRoomContext.Provider value={value}>
      {children}
    </ChatRoomContext.Provider>
  );
}

export { ChatRoomContext, ChatRoomProvider };
