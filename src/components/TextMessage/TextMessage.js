import React from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import './TextMessage.css';
import { useAuth } from '../../context/AuthContext';
import dateFormat from 'dateformat';

const TextMessage = ({ message }) => {
  const { currentUser } = useAuth();
  const extraInfo = message.type === 'information' ? true : false;
  const messageOfUserItself =
    message.senderID === currentUser._id ? true : false;
  const userMessageClass = messageOfUserItself ? 'userMessage' : '';

  return !extraInfo ? (
    <div className={`messageBox ${userMessageClass}`}>
      <div className={`msgText ${userMessageClass}`}>
        <div>
          <span>{message.message}</span>
          {messageOfUserItself ? <span className="som">&nbsp;</span> : null}
        </div>
        {messageOfUserItself ? (
          <div class="msgStatus">
            <svg viewBox="0 0 16 15" width="16" height="15" class="">
              <path
                fill="currentColor"
                d="m15.01 3.316-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
            </svg>
          </div>
        ) : null}
      </div>
      <div className={`msgSenderInfo ${userMessageClass} `}>
        {message.showUserInfo ? (
          messageOfUserItself ? (
            <>
              <div className="msgTimestamp">
                {dateFormat(new Date(message.updatedAt), 'h:MM TT')}
              </div>
              <UserAvatar imgSrc={`${message.senderPhotoUrl}`} size="20px" />
              <div className="msgSenderName">You</div>
            </>
          ) : (
            <>
              <UserAvatar imgSrc={`${message.senderPhotoUrl}`} size="20px" />
              <div className="msgSenderName">{message.senderName}</div>
              <div className="msgTimestamp">
                {dateFormat(new Date(message.updatedAt), 'h:MM TT')}
              </div>
            </>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  ) : (
    <div className="extraInfo">
      <p>
        {message.userInfo.userName.length >= 20
          ? message.userInfo.userName.slice(0, 20) + '...'
          : message.userInfo.userName}{' '}
        has joined.
      </p>
    </div>
  );
};

export default TextMessage;
