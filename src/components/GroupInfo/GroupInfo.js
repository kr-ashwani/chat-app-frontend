import React from 'react';
import './GroupInfo.css';
import groupIcon from '../../assets/groupIcon.svg';
import UserAvatar from '../UserAvatar/UserAvatar';
import AnimatedInput from '../AnimatedInput/AnimatedInput';
import { useAuth } from '../../context/AuthContext';

const GroupInfo = ({ setSlideInfo }) => {
  const { currentUser } = useAuth();

  function getChangedValue(changedValue) {}
  return (
    <div className="grp-info">
      <div className="dashboard-type">
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          onClick={() => setSlideInfo({ direction: '', component: '' })}>
          <path
            fill="currentColor"
            d="m12 4 1.4 1.4L7.8 11H20v2H7.8l5.6 5.6L12 20l-8-8 8-8z"></path>
        </svg>
        <h1>Profile</h1>
      </div>
      <div className="grp-info-column">
        <UserAvatar imgSrc={groupIcon} size="212px" changeAvatar={true} />
        <p className="infoTitle">First Name</p>
        <AnimatedInput
          value="firstName"
          user={currentUser}
          type="text"
          getChangedValue={getChangedValue}
        />
      </div>
    </div>
  );
};

export default GroupInfo;
