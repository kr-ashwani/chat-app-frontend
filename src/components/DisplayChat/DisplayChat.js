import React, { useEffect, useState } from 'react';
import 'emoji-picker-element';
import './DisplayChat.css';
import ChatInput from '../ChatInput/ChatInput';
import ChatScreen from '../ChatScreen/ChatScreen';
import useSelectedChat from '../../hooks/useSelectedChat';
import UserAvatar from '../UserAvatar/UserAvatar';
import { useSocket } from '../../context/SocketContext';
import useChatRoom from '../../hooks/useChatRoom';
import { useAuth } from '../../context/AuthContext';

const DisplayChat = () => {
  const { selectedChat } = useSelectedChat();
  const [chatRoomMessages, setChatRoomMessages] = useState({});

  const { currentUser } = useAuth();
  const { setChatRooms } = useChatRoom();
  const { socket } = useSocket();

  useEffect(() => {
    async function getChatList(payload) {
      if (payload.error) return console.log(payload.error);
      const roomIdMap = payload.response.reduce(
        (accum, elem) => ({ ...accum, [elem._id]: elem }),
        {}
      );
      const roomMsgMap = payload.response.reduce(
        (accum, elem) => ({ ...accum, [elem._id]: [] }),
        {}
      );
      setChatRooms(roomIdMap);
      setChatRoomMessages(roomMsgMap);
    }
    socket.emit('chatRoom:list', currentUser._id);
    socket.on('chatRoom:list', getChatList);

    return () => socket.off('chatRoom:list', getChatList);
  }, [currentUser, socket, setChatRooms]);

  useEffect(() => {
    if (!selectedChat) return;

    function getChatRoomMessages(payload) {
      if (payload.error) return console.log(payload.error);

      setChatRoomMessages((prev) => ({
        ...prev,
        [selectedChat.chatRoomID]: payload.response,
      }));
    }

    if (!chatRoomMessages[selectedChat.chatRoomID]) return;
    if (!chatRoomMessages[selectedChat.chatRoomID].length) {
      console.log('hello');
      socket.emit('message:list', selectedChat.chatRoomID);
      socket.on('message:list', getChatRoomMessages);
    }

    return () => socket.off('message:list', getChatRoomMessages);
  }, [socket, selectedChat, chatRoomMessages]);

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
      <ChatScreen
        setChatRoomMessages={setChatRoomMessages}
        chatRoomMessages={chatRoomMessages}
      />
      <ChatInput setChatRoomMessages={setChatRoomMessages} />
    </div>
  );
};

export default DisplayChat;
