import React, { useState } from 'react';

const ReplyMessageContext = React.createContext();

function ReplyMessageProvider({ children }) {
  const [repliedMessage, setRepliedMessage] = useState({
    replied: false,
    message: null,
    replierID: '',
    messageType: '',
    messageThumbnail: '',
    messageID: '',
    userName: '',
    userID: '',
    userPhotoUrl: '',
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
