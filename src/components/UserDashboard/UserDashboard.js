import React from 'react';
import UserAvatar from './../UserAvatar/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import AnimatedInput from '../AnimatedInput/AnimatedInput';
import './UserDashboard.css';
import dateFormat from 'dateformat';

const UserDashboard = ({ setSlideInfo }) => {
  const { currentUser } = useAuth();

  const { socket } = useSocket();

  function getChangedValue(changedValue) {
    if (changedValue.fileUrl) {
      socket.emit('user:profile:update', {
        userID: currentUser._id,
        changedValue,
      });
      return;
    }
    if (
      currentUser[Object.keys(changedValue)[0]] ===
      Object.values(changedValue)[0]
    )
      return;

    socket.emit('user:profile:update', {
      userID: currentUser._id,
      changedValue,
    });
  }

  return (
    <div className="dashboard">
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

      <UserAvatar
        size="200px"
        changeAvatarInfo={{
          type: 'hover',
          message: 'change profile photo',
        }}
        imgSrc={currentUser.photoUrl}
        fileUploadedCb={getChangedValue}
      />
      <div className="userInformation">
        <div className={`userDetail `}>
          <p className="infoTitle">First Name</p>
          <AnimatedInput
            value="firstName"
            user={currentUser}
            type="text"
            getChangedValue={getChangedValue}
          />

          <p className="infoTitle">Last Name</p>
          <AnimatedInput
            value="lastName"
            user={currentUser}
            type="text"
            getChangedValue={getChangedValue}
          />

          <p className="infoTitle">Email address</p>
          <p>{currentUser.email}</p>

          <p className="infoTitle">Last Signed in</p>
          <p>
            {dateFormat(new Date(currentUser.lastLoginAt), 'dS mmmm, yyyy')}
          </p>

          <p className="infoTitle">Account created on</p>
          <p>{dateFormat(new Date(currentUser.createdAt), 'dS mmmm, yyyy')}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
