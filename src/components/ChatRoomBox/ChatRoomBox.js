import React from 'react';
import useSelectedChat from '../../hooks/useSelectedChat';
import UserAvatar from '../UserAvatar/UserAvatar';
import './ChatRoomBox.css';

const ChatRoomBox = ({ chatRoomDetail }) => {
  const { setSelectedChat } = useSelectedChat();

  async function openChatRoomMessages(e, chatRoomInfo) {
    Array.from(
      document.getElementsByClassName('chatRoomList')[0].children
    ).forEach((elem) => elem.classList.remove('selected'));
    e.currentTarget.classList.add('selected');

    const { _id: chatRoomID, ...selected } = chatRoomInfo;
    setSelectedChat({ ...selected, chatRoomID });
  }

  return (
    <div
      className="chatRoomBox"
      onClick={(e) => openChatRoomMessages(e, chatRoomDetail)}>
      <div className="chatRoomImg">
        <UserAvatar imgSrc={chatRoomDetail.photoUrl} size="50px" />
      </div>
      <div className="chatRoomDetail">
        <div className="chatRoomName">
          <h4>{chatRoomDetail.firstName + ' ' + chatRoomDetail.lastName}</h4>
        </div>
        <div className="chatRoomMsg">
          <span>{chatRoomDetail.lastMessage}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomBox;
