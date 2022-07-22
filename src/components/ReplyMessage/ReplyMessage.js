import React from 'react';
import { useAuth } from '../../context/AuthContext';
import smoothScrollToMessage from '../../utils/smoothScrollToMessage';
import UserAvatar from '../UserAvatar/UserAvatar';
import './ReplyMessage.css';

const ReplyMessage = ({ repliedMessage }) => {
  const { currentUser } = useAuth();
  if (!repliedMessage?.replied) return <></>;

  const messageOfUserItself =
    repliedMessage.replierID === currentUser._id ? true : false;
  const userMessageClass = messageOfUserItself ? 'userMessage' : '';

  function scrollBackToMessage(e) {
    const prevMsg = document.getElementById(e.currentTarget.dataset.messageId);
    const chatList = document.getElementsByClassName('chatList')[0];

    smoothScrollToMessage(chatList, prevMsg);
    // prevMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // setTimeout(() => {
    //   prevMsg.children[0].classList.add('highlight');
    //   setTimeout(() => {
    //     prevMsg.children[0].classList.remove('highlight');
    //   }, 500);
    // }, 400);
  }

  return (
    <div
      className={`reply ${userMessageClass}`}
      data-message-id={repliedMessage.messageID}
      onClick={scrollBackToMessage}>
      <div className="replyUser">
        <UserAvatar imgSrc={repliedMessage.userPhotoUrl} size="20px" />
        {repliedMessage.userID === currentUser._id ? (
          <span>
            <p>You</p>
          </span>
        ) : (
          <span>
            <p>{repliedMessage.userName}</p>
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
