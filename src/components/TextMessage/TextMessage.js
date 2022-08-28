import React, { useRef } from 'react';
import { getDateString } from '../../utils/getdateString';

import UserAvatar from '../UserAvatar/UserAvatar';
import './TextMessage.css';
import { useAuth } from '../../context/AuthContext';
import dateFormat from 'dateformat';
import ReplyMessage from '../ReplyMessage/ReplyMessage';
import useReply from '../../hooks/useReply';
import useMessage from './../../hooks/useChatRoomMessage';
import useSelectedChat from './../../hooks/useSelectedChat';
import { useEffect } from 'react';
import FileMessage from '../FileMessage/FileMessage';
import MessageStatus from './MessageStatus';

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
  const msgDiv = useRef();
  const replyDiv = useRef();
  const touchSelect = useRef(true);

  function replyToMessage(e, id) {
    if (e.target !== e.currentTarget) if (!id) return;
    replyDiv.current.classList.add('show');

    setTimeout(() => {
      replyDiv.current.classList.remove('show');
    }, 300);

    let msgID = id || e.target.dataset.messageId;

    if (repliedMessage.messageID !== msgID) {
      const {
        message,
        senderID,
        messageType,
        senderName,
        messageID,
        chatRoomID,
        senderPhotoUrl,
      } = chatRoomMessages[selectedChat.chatRoomID][msgID];
      setRepliedMessage((prev) => ({
        message,
        senderID,
        messageType,
        senderName,
        chatRoomID,
        senderPhotoUrl,
        messageID,
      }));

      navigator.vibrate(200);
    }
  }

  useEffect(() => {
    if (!msgDiv.current) return;
    let x = 0;
    msgDiv.current.addEventListener('touchstart', (e) => {
      const touch = e.targetTouches[0];
      x = touch.clientX;
    });

    msgDiv.current.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      touchSelect.current = true;
      msgDiv.current.style.transition = `transform 300ms ease-in-out`;
      setTimeout(() => {
        msgDiv.current.style.transform = `translate3d(${0}px,0,0)`;
      }, 10);

      setTimeout(() => {
        msgDiv.current.style.transition = ``;
      }, 300);

      x = touch.clientX;
    });
    msgDiv.current.addEventListener('touchmove', (e) => {
      const touch = e.targetTouches[0];
      if (touch.clientX - x > 70) return;
      if (touch.clientX - x > 45)
        if (touchSelect.current) {
          touchSelect.current = false;
          let path = e.path || (e.composedPath && e.composedPath());
          for (let i = 0; i < path.length; i++)
            if (path[i].classList.contains('messageCover')) {
              setTimeout(() => {
                replyToMessage(e, path[i].dataset.messageId);
              }, 100);
              break;
            }
        }
      if (touch.clientX - x > 20)
        msgDiv.current.style.transform = `translate3d(${
          touch.clientX - x
        }px,0,0)`;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !extraInfo ? (
    <div
      className={`messageCover`}
      data-message-id={`${message.messageID}`}
      onDoubleClick={(e) => replyToMessage(e)}>
      <i ref={replyDiv} className="fas fa-reply"></i>
      <div
        className={`messageBox ${userMessageClass}`}
        id={`${message.messageID}`}>
        <div ref={msgDiv} className={`msgText ${userMessageClass}`}>
          {message.repliedMessage ? (
            <ReplyMessage repliedMessage={message.repliedMessage} />
          ) : (
            <></>
          )}
          {!message.fileInfo ? (
            <div className="msg">
              <span>{message.message}</span>
              {messageOfUserItself ? <span className="som">&nbsp;</span> : null}
            </div>
          ) : (
            <FileMessage message={message} />
          )}
          <MessageStatus
            message={message}
            messageOfUserItself={messageOfUserItself}
            messageStats={messageStats}
          />
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
      {message.message ? (
        <p>{message.message}</p>
      ) : (
        <p>{getDateString(message.createdAt, true)}</p>
      )}
    </div>
  );
};

export default TextMessage;
