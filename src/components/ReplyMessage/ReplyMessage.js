import React from 'react';
import { useAuth } from '../../context/AuthContext';
import smoothScrollToMessage from '../../utils/smoothScrollToMessage';
import UserAvatar from '../UserAvatar/UserAvatar';
import { FileIcon, defaultStyles } from 'react-file-icon';
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
      className={`reply ${repliedMessage.fileInfo ? 'fileReply' : ''}`}
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
      {repliedMessage.message ? (
        <div className="replyMsg">
          <p>{repliedMessage.message}</p>
        </div>
      ) : (
        <div className="replyFileMsg2">
          {repliedMessage.fileInfo.inputType === 'photos/videos' ? (
            <img src={repliedMessage.fileInfo.url} alt="file" />
          ) : (
            <div className="icon">
              <FileIcon
                extension={repliedMessage.fileInfo.extension}
                {...defaultStyles[repliedMessage.fileInfo.extension]}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReplyMessage;
