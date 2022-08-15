import React, { useState } from 'react';

const ReplyMessageContext = React.createContext();

function ReplyMessageProvider({ children }) {
  const [repliedMessage, setRepliedMessage] = useState({
    message: '',
    senderID: '',
    messageType: '',
    messageID: null,
    chatRoomID: null,
    senderName: '',
    senderPhotoUrl: '',
  });

  const value = {
    repliedMessage,
    setRepliedMessage,
  };

  return (
    <ReplyMessageContext.Provider value={value}>
      {children}
    </ReplyMessageContext.Provider>
  );
}

export { ReplyMessageContext, ReplyMessageProvider };
