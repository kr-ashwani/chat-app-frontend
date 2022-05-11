import React, { useEffect, useState } from 'react';
import 'emoji-picker-element';
import './DisplayChat.css';
import ChatInput from '../ChatInput/ChatInput';
import ChatScreen from '../ChatScreen/ChatScreen';
import useSelectedChat from '../../hooks/useSelectedChat';
import UserAvatar from '../UserAvatar/UserAvatar';
import { useSocket } from '../../context/SocketContext';

const DisplayChat = () => {
  const { selectedChat } = useSelectedChat();
  const [chatRoomMessages, setChatRoomMessages] = useState({});

  const { socket } = useSocket();

  useEffect(() => {
    if (!selectedChat) return;

    function getChatRoomMessages(payload) {
      if (payload.error) return console.log(payload.error);

      setChatRoomMessages((prev) => ({
        ...prev,
        [selectedChat.chatRoomID]: payload.response,
      }));
    }

    if (!chatRoomMessages[selectedChat.chatRoomID]) {
      socket.emit('message:list', selectedChat.chatRoomID);
      socket.on('message:list', getChatRoomMessages);
    }

    return () => socket.off('message:list', getChatRoomMessages);
  }, [chatRoomMessages, socket, selectedChat]);

  return (
    <div className="displayChat">
      <div className="roomName">
        <UserAvatar imgSrc={selectedChat?.photoUrl} size="25px" />
        <h3 style={{ marginLeft: '10px' }}>
          {selectedChat
            ? selectedChat.firstName + ' ' + selectedChat.lastName
            : '😍'}
        </h3>
      </div>
      <ChatScreen chatRoomMessages={chatRoomMessages} />
      <ChatInput setChatRoomMessages={setChatRoomMessages} />
    </div>
  );
};

export default DisplayChat;
