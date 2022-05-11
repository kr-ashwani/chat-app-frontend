import React from 'react';
import './GroupChat.css';

const GroupChat = () => {
  return (
    <div className="groupChat">
      <div className="groupChatDetail">
        <div className="heading">
          <div
            className="cancel"
            onClick={() => {
              document
                .getElementsByClassName('groupChat')[0]
                .classList.remove('show');
            }}>
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
