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
import chattingImg from '../../assets/chatting.svg';

const DisplayChat = () => {
  const { selectedChat } = useSelectedChat();
  const [chatRoomMessages, setChatRoomMessages] = useState({});

  const { currentUser } = useAuth();
  const { setChatRooms } = useChatRoom();
  const { socket } = useSocket();

  useEffect(() => {
    async function getChatList(payload) {
      if (payload.error) return console.log(payload.error);
      const roomIdMap = payload.response.reduce((accum, elem) => {
        socket.emit('message:list', elem._id);
        return { ...accum, [elem._id]: elem };
      }, {});
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
    function getChatRoomMessages(payload) {
      if (payload.error) return console.log(payload.error);

      setChatRoomMessages((prev) => ({
        ...prev,
        [payload.chatRoomID]: payload.chatRoomMsgs,
      }));
    }
    socket.on('message:list', getChatRoomMessages);
    return () => socket.off('message:list', getChatRoomMessages);
  }, [socket]);

  useEffect(() => {
    if (selectedChat) {
      document.getElementsByClassName('displayChat')[0].classList.add('show');
      document.getElementsByClassName('chatGroup')[0].classList.add('shift');
    }
  }, [selectedChat]);

  return (
    <div className="displayChat">
      <div className="welcomeScreen">
        <div className="logo">
          <img src={chattingImg} alt="chatx logo" />
          <h2>Chatx</h2>
          <p>Realtime chat app for web</p>
        </div>
      </div>

      <div className="roomName">
        <i
          className="fa-solid fa-arrow-left"
          onClick={() => {
            document
              .getElementsByClassName('displayChat')[0]
              .classList.remove('show');

            document
              .getElementsByClassName('chatGroup')[0]
              .classList.remove('shift');
          }}></i>
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
