import React, { useState } from 'react';

const ChatRoomMessageContext = React.createContext();

function ChatRoomMessageProvider({ children }) {
  const [chatRoomMessages, setChatRoomMessages] = useState({});

  const value = {
    chatRoomMessages,
    setChatRoomMessages,
  };

  return (
    <ChatRoomMessageContext.Provider value={value}>
      {children}
    </ChatRoomMessageContext.Provider>
  );
}

export { ChatRoomMessageContext, ChatRoomMessageProvider };
