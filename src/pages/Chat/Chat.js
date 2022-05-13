import React, { useEffect } from 'react';
import ChatRooms from '../../components/ChatRooms/ChatRooms';
import DisplayChat from '../../components/DisplayChat/DisplayChat';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { setCookie } from '../../cookie';

import './Chat.css';

function Chat() {
  const { currentUser } = useAuth();

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket.auth) return;
    if (socket.auth.userID) socket.connect();
    return () => socket.disconnect();
  }, [socket, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    setCookie('user_id', currentUser._id, 100);
  }, [currentUser]);

  return (
    <>
      <div className="chatApp">
        <div className="chatSection">
          <ChatRooms />
          <DisplayChat />
        </div>
      </div>
    </>
  );
}

export default Chat;
