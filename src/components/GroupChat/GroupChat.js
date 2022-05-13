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
          <h2>Members</h2>
          <div className="next">Next</div>
        </div>
        <div className="userSearch">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search" />
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
