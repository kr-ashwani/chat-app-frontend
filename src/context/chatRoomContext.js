import React, { useState } from 'react';

const ChatRoomContext = React.createContext();

function ChatRoomProvider({ children }) {
  const [chatRooms, setChatRooms] = useState({});

  const value = {
    chatRooms,
    setChatRooms,
  };

  return (
    <ChatRoomContext.Provider value={value}>
      {children}
    </ChatRoomContext.Provider>
  );
}

export { ChatRoomContext, ChatRoomProvider };
