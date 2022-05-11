import React from 'react';
import useSelectedChat from '../../hooks/useSelectedChat';
import UserAvatar from '../UserAvatar/UserAvatar';
import './ChatRoomBox.css';

const ChatRoomBox = ({ chatRoomDetail }) => {
  const { setSelectedChat } = useSelectedChat();

  async function openChatRoomMessages(chatRoomInfo) {
    const { _id: chatRoomID, ...selected } = chatRoomInfo;
    setSelectedChat({ ...selected, chatRoomID });
  }

  return (
    <div
      className="chatRoomBox"
      onClick={() => openChatRoomMessages(chatRoomDetail)}>
      <div className="chatRoomImg">
        <UserAvatar imgSrc={chatRoomDetail.photoUrl} size="50px" />
      </div>
      <div className="chatRoomDetail">
        <div className="chatRoomName">
          <h4>{chatRoomDetail.firstName + ' ' + chatRoomDetail.lastName}</h4>
        </div>
        <div className="chatRoomMsg">
          <h5>{chatRoomDetail.lastMessage}</h5>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomBox;
