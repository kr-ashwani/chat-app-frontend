import React, { useEffect } from 'react';
import ChatRooms from '../../components/ChatRooms/ChatRooms';
import DisplayChat from '../../components/DisplayChat/DisplayChat';
import { useAuth } from '../../context/AuthContext';
import { ReplyMessageProvider } from '../../context/ReplyMessageContext';
import { useSocket } from '../../context/SocketContext';

import './Chat.css';

function Chat() {
  const { currentUser } = useAuth();

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket.auth) return;
    if (socket.auth.userID) socket.connect();
    return () => socket.disconnect();
  }, [socket, currentUser]);

  return (
    <>
      <div className="chatApp">
        <div className="chatSection">
          <ChatRooms />
          <ReplyMessageProvider>
            <DisplayChat />
          </ReplyMessageProvider>
        </div>
      </div>
    </>
  );
}

export default Chat;
