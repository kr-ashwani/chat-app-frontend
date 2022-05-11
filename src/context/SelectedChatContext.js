import React, { useState } from 'react';

const SelectedChatContext = React.createContext();

function SelectedChatProvider({ children }) {
  const [selectedChat, setSelectedChat] = useState(null);

  const value = {
    selectedChat,
    setSelectedChat,
  };

  return (
    <SelectedChatContext.Provider value={value}>
      {children}
    </SelectedChatContext.Provider>
  );
}

export { SelectedChatContext, SelectedChatProvider };
