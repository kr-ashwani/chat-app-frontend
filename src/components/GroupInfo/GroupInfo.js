import React, { useEffect, useState } from 'react';
import './GroupInfo.css';
import UserAvatar from '../UserAvatar/UserAvatar';
import useChatRoom from './../../hooks/useChatRoom';
import { useAuth } from '../../context/AuthContext';

const GroupInfo = ({ setSlideInfo, selectedUser, setSelectedUser }) => {
  const [groupSubject, setGroupSubject] = useState('');
  const [groupPhotoUrl, setGroupPhotoUrl] = useState({
    type: 'default',
    url: 'https://msgbits.s3.ap-south-1.amazonaws.com/group+image-1661513896201.png',
  });
  const { currentUser } = useAuth();
  const { setNewGroupChatInfo } = useChatRoom();

  useEffect(() => {
    setTimeout(() => {
      document.querySelector('.grp-subject-input > input').focus();
    }, 500);
  }, []);

  function getChangedValue(changedValue) {
    if (changedValue.fileUrl)
      setGroupPhotoUrl({
        type: 'changed',
        url: changedValue.fileUrl,
      });
  }
  function makeNewGroup() {
    if (!groupSubject.length) return;

    const members = selectedUser.map((elem) => elem._id);
    members.push(currentUser._id);
    setNewGroupChatInfo({
      groupChatName: groupSubject,
      groupChatPicture: groupPhotoUrl.url,
      participants: members,
    });
    setSelectedUser([]);
    document.getElementsByClassName('groupChat')[0].classList.remove('show');
    setSlideInfo({ direction: '', component: '' });
  }
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
        <h1>New Group</h1>
      </div>
      <div className="grp-info-column">
        <UserAvatar
          imgSrc={groupPhotoUrl.url}
          size="212px"
          changeAvatarInfo={
            groupPhotoUrl.type === 'changed'
              ? { type: 'hover', message: 'change group icon' }
              : {
                  type: 'show',
                  message: 'add group icon',
                }
          }
          fileUploadedCb={getChangedValue}
        />

        <div className="grp-subject">
          <p>Group Subject</p>
          <div className="grp-subject-input">
            <input
              type="text"
              value={groupSubject}
              onChange={(e) => {
                if (e.target.value.length > 24) return;
                if (e.target.value.trim()) setGroupSubject(e.target.value);
                else setGroupSubject('');
              }}
            />
            <p className="grp-count">{24 - groupSubject.length}</p>
          </div>
          <div
            className={`grp-border ${groupSubject.length ? 'show' : ''}`}></div>
        </div>

        <div
          onClick={makeNewGroup}
          className={`grp-submit ${groupSubject.length ? 'show' : ''}`}>
          <div role="button" tabIndex="0" className="_165_h">
            <span>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="m8 17.1-5.2-5.2-1.7 1.7 6.9 7L22.9 5.7 21.2 4 8 17.1z"></path>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
