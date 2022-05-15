import React, { useEffect } from 'react';
import './ChatScreen.css';
import useSelectedChat from '../../hooks/useSelectedChat';
import { useSocket } from '../../context/SocketContext';
import TextMessage from '../TextMessage/TextMessage';

const ChatScreen = ({ chatRoomMessages, setChatRoomMessages }) => {
  const { selectedChat } = useSelectedChat();
  const { socket } = useSocket();

  useEffect(() => {
    console.log('selectedChat : ', selectedChat);
    if (selectedChat)
      document.getElementsByClassName('welcomeScreen')[0].classList.add('hide');
  }, [selectedChat]);

  useEffect(() => {
    const viewChat = document.getElementsByClassName('viewChat')[0];
    viewChat.style.scrollBehavior = 'smooth';
    viewChat.scrollTop = viewChat.scrollHeight;
    viewChat.style.scrollBehavior = 'auto';
  }, [chatRoomMessages]);

  useEffect(() => {
    const viewChat = document.getElementsByClassName('viewChat')[0];
    viewChat.style.scrollBehavior = 'auto';
    viewChat.scrollTop = viewChat.scrollHeight;
  }, [selectedChat]);

  // socket realtime new message
  useEffect(() => {
    function newMessage({ newMsg, lastMsg }) {
      setChatRoomMessages((prev) => {
        const prevMsg = prev[newMsg.chatRoomID];
        if (lastMsg && prevMsg)
          for (let i = prevMsg.length - 1; i >= 0; i--) {
            if (prevMsg[i].createdAt === lastMsg.createdAt) {
              prevMsg[i].showUserInfo = lastMsg.showUserInfo;
              break;
            }
          }
        if (!prevMsg) return { ...prev, [newMsg.chatRoomID]: [newMsg] };
        return { ...prev, [newMsg.chatRoomID]: [...prevMsg, newMsg] };
      });
    }

    socket.on('DB:message:create', newMessage);

    return () => socket.off('DB:message:create', newMessage);
  }, [socket, setChatRoomMessages]);

  return (
    <>
      <div className="viewChat">
        {Array.isArray(chatRoomMessages[selectedChat?.chatRoomID]) ? (
          chatRoomMessages[selectedChat?.chatRoomID].map((element, id) => {
            return <TextMessage message={element} key={id} />;
          })
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ChatScreen;
