import React, { useContext } from 'react';
import io from 'socket.io-client';
import { getCookie } from '../cookie';

const SocketContext = React.createContext();

const socket = io.connect('http://localhost:3300', {
  withCredentials: true,
  auth: {
    userID: getCookie('user_id'),
  },
});

function useSocket() {
  return useContext(SocketContext);
}

function SocketProvider({ children }) {
  const value = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export { useSocket, SocketProvider };
