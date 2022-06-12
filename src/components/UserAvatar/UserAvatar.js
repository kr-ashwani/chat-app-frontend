import React from 'react';
import './UserAvatar.css';
import defaultAvatar from '../../assets/3dAvatar.png';

const UserAvatar = ({ imgSrc, size }) => {
  function errorImage(e) {
    e.target.src = defaultAvatar;
    e.target.onerror = '';
  }
  return (
    <div className="userAvatar" style={{ height: size, width: size }}>
      <img
        src={`${imgSrc}`}
        width={size}
        height={size}
        onError={errorImage}
        alt="userImage"
      />
    </div>
  );
};

export default UserAvatar;
