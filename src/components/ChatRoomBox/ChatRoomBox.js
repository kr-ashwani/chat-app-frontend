import React from 'react';
import useSelectedChat from '../../hooks/useSelectedChat';
import { getDateString } from '../../utils/getdateString';
import UserAvatar from '../UserAvatar/UserAvatar';
import './ChatRoomBox.css';

const ChatRoomBox = ({ chatRoomDetail }) => {
  const { selectedChat, setSelectedChat } = useSelectedChat();

  async function openChatRoomMessages(e, chatRoomInfo) {
    // Array.from(
    //   document.getElementsByClassName('chatRoomList')[0].children
    // ).forEach((elem) => elem.classList.remove('selected'));
    e.currentTarget.classList.add('selected');

    if (selectedChat?.chatRoomID !== chatRoomInfo?.chatRoomID)
      setSelectedChat({ ...chatRoomInfo });
  }

  return (
    <div
      className={`chatRoomBox ${chatRoomDetail.chatRoomID}`}
      onClick={(e) => openChatRoomMessages(e, chatRoomDetail)}>
      <div className="chatRoomImg">
        <UserAvatar imgSrc={chatRoomDetail.photoUrl} size="50px" />
      </div>
      <div className="chatRoomDetail">
        <div className="chatRoomName">
          <span>
            {chatRoomDetail.firstName + ' ' + chatRoomDetail.lastName}
          </span>
          <span>{getDateString(chatRoomDetail.lastMessageTimestamp)}</span>
        </div>
        <div className="chatRoomMsg">
          <span>{chatRoomDetail.lastMessage}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomBox;
