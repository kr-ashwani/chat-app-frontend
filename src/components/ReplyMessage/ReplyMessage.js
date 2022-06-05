import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { smoothScrollTo } from '../../utils/smoothScroll';
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
    if (chatList.scrollTop > prevMsg.offsetTop) {
      if (prevMsg.clientHeight < chatList.clientHeight)
        smoothScrollTo({
          top:
            prevMsg.offsetTop -
            chatList.clientHeight / 2 +
            prevMsg.clientHeight / 2,
          duration: 600,
          element: chatList,
        });
      else
        smoothScrollTo({
          top: prevMsg.offsetTop - chatList.clientHeight / 2,
          duration: 600,
          element: chatList,
        });
      setTimeout(() => {
        prevMsg.children[0].classList.add('highlight');
        setTimeout(() => {
          prevMsg.children[0].classList.remove('highlight');
        }, 500);
      }, 600);
    } else
      setTimeout(() => {
        prevMsg.children[0].classList.add('highlight');
        setTimeout(() => {
          prevMsg.children[0].classList.remove('highlight');
        }, 500);
      }, 100);
  }

  return (
    <div
      className={`reply ${userMessageClass}`}
      data-message-id={repliedMessage.messageID}
      onClick={scrollBackToMessage}>
      <div className="replyUser">
        <UserAvatar imgSrc={repliedMessage.userPhotoUrl} size="20px" />
        {messageOfUserItself ? (
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
