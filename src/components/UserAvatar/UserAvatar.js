import React, { useRef } from 'react';
import './UserAvatar.css';
import defaultAvatar from '../../assets/3dAvatar.png';
import uploadFile from '../../utils/uploadFile';

const UserAvatar = ({
  imgSrc,
  size,
  clickFunction,
  AvatarStyle = {},
  changeAvatarInfo = {},
  fileUploadedCb,
}) => {
  const fileRef = useRef();
  function errorImage(e) {
    e.target.src = defaultAvatar;
    e.target.onerror = '';
  }
  function selectFile(e) {
    if (fileRef.current) fileRef.current.click();
  }

  const msg = changeAvatarInfo.message
    ? changeAvatarInfo.message.split(' ')
    : [''];
  msg.shift();
  return (
    <div
      onClick={() => {
        if (typeof clickFunction === 'function') clickFunction();
      }}
      className="userAvatar"
      style={{ ...{ height: size, width: size }, ...AvatarStyle }}>
      {changeAvatarInfo.type ? (
        <div className={`changeAvatar ${changeAvatarInfo.type}`}>
          <input
            ref={fileRef}
            type="file"
            accept="image/gif,image/jpeg,image/jpg,image/png"
            style={{ display: 'none' }}
            onChange={(e) => uploadFile(e, fileUploadedCb)}
          />
          <span data-testid="camera" data-icon="camera" onClick={selectFile}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M21.317 4.381H10.971L9.078 2.45c-.246-.251-.736-.457-1.089-.457H4.905c-.352 0-.837.211-1.078.468L1.201 5.272C.96 5.529.763 6.028.763 6.38v1.878l-.002.01v11.189a1.92 1.92 0 0 0 1.921 1.921h18.634a1.92 1.92 0 0 0 1.921-1.921V6.302a1.92 1.92 0 0 0-1.92-1.921zM12.076 18.51a5.577 5.577 0 1 1 0-11.154 5.577 5.577 0 0 1 0 11.154zm0-9.506a3.929 3.929 0 1 0 0 7.858 3.929 3.929 0 0 0 0-7.858z"></path>
            </svg>
          </span>
          <div data-testid="avatar-text">
            <span style={{ textAlign: 'center', display: 'block' }}>
              {changeAvatarInfo.message.split(' ')[0]}{' '}
            </span>{' '}
            {msg.join(' ')}
          </div>
        </div>
      ) : (
        <></>
      )}
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
