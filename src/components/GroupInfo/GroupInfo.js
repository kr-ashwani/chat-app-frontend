import React from 'react';
import './GroupInfo.css';
import groupIcon from '../../assets/groupIcon.svg';
import UserAvatar from '../UserAvatar/UserAvatar';

const GroupInfo = () => {
  console.log(groupIcon);
  return (
    <div className="grp-info">
      <UserAvatar imgSrc={groupIcon} size="212px" changeAvatar={true} />
    </div>
  );
};

export default GroupInfo;
