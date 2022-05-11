import React, { useEffect } from 'react';
import TextMessage from '../TextMessage/TextMessage';
import './ChatScreen.css';
import useSelectedChat from '../../hooks/useSelectedChat';

const ChatScreen = ({ chatRoomMessages }) => {
  const { selectedChat } = useSelectedChat();

  useEffect(() => {
    console.log('selectedChat : ', selectedChat);
  }, [selectedChat]);

  useEffect(() => {
    const viewChat = document.getElementsByClassName('viewChat')[0];
    viewChat.scrollTop = viewChat.scrollHeight;
  }, [selectedChat, chatRoomMessages]);

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
