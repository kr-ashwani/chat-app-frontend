import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = React.createContext();

function useSocket() {
  return useContext(SocketContext);
}

function SocketProvider({ children }) {
  const [socket, setSocket] = useState(
    io.connect(process.env.REACT_APP_SERVER_ENDPOINT, {
      autoConnect: false,
    })
  );

  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?._id) return;
    setSocket(
      io.connect(process.env.REACT_APP_SERVER_ENDPOINT, {
        withCredentials: true,
        autoConnect: false,
        auth: {
          userID: currentUser._id,
        },
      })
    );
  }, [currentUser._id]);

  const value = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export { useSocket, SocketProvider };
