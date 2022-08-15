import React from 'react';
import { getDateString } from '../../utils/getdateString';

import UserAvatar from '../UserAvatar/UserAvatar';
import './TextMessage.css';
import { useAuth } from '../../context/AuthContext';
import dateFormat from 'dateformat';
import ReplyMessage from '../ReplyMessage/ReplyMessage';
import useReply from '../../hooks/useReply';
import useMessage from './../../hooks/useChatRoomMessage';
import useSelectedChat from './../../hooks/useSelectedChat';

const TextMessage = ({ message }) => {
  const { currentUser } = useAuth();
  const extraInfo = message.messageType === 'information' ? true : false;
  const messageOfUserItself =
    message.senderID === currentUser._id ? true : false;
  const userMessageClass = messageOfUserItself ? 'userMessage' : '';
  const messageStats = message.messageStatus.seen
    ? 'seen'
    : message.messageStatus.delivered
    ? 'delivered'
    : message.messageStatus.sent
    ? 'sent'
    : 'pending';

  const { repliedMessage, setRepliedMessage } = useReply();
  const { chatRoomMessages } = useMessage();
  const { selectedChat } = useSelectedChat();

  function replyToMessage(e) {
    if (e.target !== e.currentTarget) return;
    if (repliedMessage.messageID !== e.target.dataset.messageId) {
      const {
        message,
        senderID,
        messageType,
        senderName,
        messageID,
        chatRoomID,
        senderPhotoUrl,
      } = chatRoomMessages[selectedChat.chatRoomID][e.target.dataset.messageId];
      setRepliedMessage((prev) => ({
        message,
        senderID,
        messageType,
        senderName,
        chatRoomID,
        senderPhotoUrl,
        messageID,
      }));
    }
  }

  return !extraInfo ? (
    <div
      className={`messageCover`}
      data-message-id={`${message.messageID}`}
      onDoubleClick={(e) => replyToMessage(e)}>
      <div
        className={`messageBox ${userMessageClass}`}
        id={`${message.messageID}`}>
        <div className={`msgText ${userMessageClass}`}>
          {message.repliedMessage ? (
            <ReplyMessage repliedMessage={message.repliedMessage} />
          ) : (
            <></>
          )}
          <div className="msg">
            <span>{message.message}</span>
            {messageOfUserItself ? <span className="som">&nbsp;</span> : null}
          </div>
          {messageOfUserItself ? (
            <div className={`msgStatus ${message.messageID}`}>
              {messageStats === 'pending' ? (
                <svg
                  // className={messageStats === 'pending' ? '' : 'hide'}
                  viewBox="0 0 16 15"
                  width="16"
                  height="15">
                  <path
                    fill="currentColor"
                    d="M9.75 7.713H8.244V5.359a.5.5 0 0 0-.5-.5H7.65a.5.5 0 0 0-.5.5v2.947a.5.5 0 0 0 .5.5h.094l.003-.001.003.002h2a.5.5 0 0 0 .5-.5v-.094a.5.5 0 0 0-.5-.5zm0-5.263h-3.5c-1.82 0-3.3 1.48-3.3 3.3v3.5c0 1.82 1.48 3.3 3.3 3.3h3.5c1.82 0 3.3-1.48 3.3-3.3v-3.5c0-1.82-1.48-3.3-3.3-3.3zm2 6.8a2 2 0 0 1-2 2h-3.5a2 2 0 0 1-2-2v-3.5a2 2 0 0 1 2-2h3.5a2 2 0 0 1 2 2v3.5z"></path>
                </svg>
              ) : messageStats === 'sent' ? (
                <svg
                  // className={messageStats === 'sent' ? '' : 'hide'}
                  viewBox="0 0 16 15"
                  width="16"
                  height="15">
                  <path
                    fill="currentColor"
                    d="m10.91 3.316-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                </svg>
              ) : messageStats === 'delivered' ? (
                <svg
                  // className={messageStats === 'delivered' ? '' : 'hide'}
                  viewBox="0 0 16 15"
                  width="16"
                  height="15">
                  <path
                    fill="currentColor"
                    d="m15.01 3.316-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                </svg>
              ) : (
                <svg
                  className="svgSeen"
                  // className={`svgSeen ${messageStats === 'seen' ? '' : 'hide'}`}
                  viewBox="0 0 16 15"
                  width="16"
                  height="15">
                  <path
                    fill="currentColor"
                    d="m15.01 3.316-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                </svg>
              )}
            </div>
          ) : null}
        </div>
        {message.showUserInfo ? (
          <div className={`msgSenderInfo ${userMessageClass} `}>
            {messageOfUserItself ? (
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
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  ) : (
    <div className="extraInfo">
      <p>{getDateString(message.createdAt, true)}</p>
    </div>
  );
};

export default TextMessage;
