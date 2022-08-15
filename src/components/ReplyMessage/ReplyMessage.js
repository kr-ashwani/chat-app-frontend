import React from 'react';
import { useAuth } from '../../context/AuthContext';
import smoothScrollToMessage from '../../utils/smoothScrollToMessage';
import UserAvatar from '../UserAvatar/UserAvatar';
import './ReplyMessage.css';

const ReplyMessage = ({ repliedMessage }) => {
  const { currentUser } = useAuth();

  function scrollBackToMessage(e) {
    const prevMsg = document.getElementById(e.currentTarget.dataset.messageId);
    const chatList = document.getElementsByClassName('chatList')[0];

    smoothScrollToMessage(chatList, prevMsg);
  }

  return (
    <div
      className={`reply`}
      data-message-id={repliedMessage.messageID}
      onClick={scrollBackToMessage}>
      <div className="replyUser">
        <UserAvatar imgSrc={repliedMessage.senderPhotoUrl} size="20px" />
        {repliedMessage.senderID === currentUser._id ? (
          <span>
            <p>You</p>
          </span>
        ) : (
          <span>
            <p>{repliedMessage.senderName}</p>
          </span>
        )}
      </div>
      <div className="replyMsg">
        <p>{repliedMessage.message}</p>
      </div>
    </div>
  );
};

export default ReplyMessage;
