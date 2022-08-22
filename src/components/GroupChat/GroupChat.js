import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import GroupInfo from '../GroupInfo/GroupInfo';
import GroupParticipants from '../GroupParticipants/GroupParticipants';
import StackSlide from '../StackSlide/StackSlide';
import UserAvatar from '../UserAvatar/UserAvatar';
import './GroupChat.css';

const GroupChat = () => {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const { currentUser } = useAuth();
  const [searchUser, setSearchUser] = useState('');
  const [filteredUserList, setFilteredUserList] = useState([]);
  const { socket } = useSocket();
  const selectedUserRef = useRef();

  useEffect(() => {
    async function getUserList(payload) {
      if (payload.error) return console.log(payload.error);
      setUserList(payload.response);
    }
    socket.emit('user:list', currentUser._id);
    socket.on('user:list', getUserList);

    return () => socket.off('user:list', getUserList);
  }, [currentUser, socket]);

  const [slideInfo, setSlideInfo] = useState({
    direction: '',
    component: '',
  });

  useEffect(() => {
    setFilteredUserList(
      userList.filter((elem) =>
        (elem.firstName + ' ' + elem.lastName)
          .toLowerCase()
          .includes(searchUser.toLowerCase())
      )
    );
  }, [searchUser, userList]);

  useEffect(() => {
    if (selectedUser.length)
      document.getElementsByClassName('grp-list')[0].classList.add('selected');
    else
      document
        .getElementsByClassName('grp-list')[0]
        .classList.remove('selected');
  }, [selectedUser]);

  async function addParticipants(e, id) {
    if (selectedUserRef.current) return;
    const container = id
      ? document.querySelector(`[data-userid="${e.currentTarget.dataset.id}"]`)
      : e.currentTarget;

    const userID = id ? e.currentTarget.dataset.id : container.dataset.userid;
    selectedUserRef.current = userID;
    if (container === null || container.classList.contains('selected')) {
      if (container) container.classList.remove('selected');
      selectedUserRef.current = 'occupied';
      const box = document.querySelector(`[data-listuserid="${userID}"]`);
      box.style.transform = 'scale(0)';
      const grpList = document.getElementsByClassName('grp-list')[0];
      grpList.classList.add('animateTranslate');
      setTimeout(() => {
        setSelectedUser((prev) => prev.filter((elem) => elem._id !== userID));
        setTimeout(() => {
          grpList.classList.remove('animateTranslate');
          selectedUserRef.current = null;
        }, 210);
      }, 200);
    } else {
      container.classList.add('selected');
      setSelectedUser((prev) => [
        ...prev,
        userList.filter((elm) => elm._id === userID)[0],
      ]);
    }
  }

  useEffect(() => {
    if (!selectedUserRef.current) return;

    const box = document.querySelector(
      `[data-listuserid="${selectedUserRef.current}"]`
    );
    const grpList = document.getElementsByClassName('grp-list')[0];
    if (box) {
      grpList.scrollLeft = grpList.scrollHeight + 999;
      if (grpList.scrollHeight - grpList.clientWidth > 0)
        setTimeout(() => {
          box.style.transform = 'scale(1)';
        }, 150);
      else
        setTimeout(() => {
          box.style.transform = 'scale(1)';
        }, 10);
    }

    setTimeout(() => {
      selectedUserRef.current = null;
    }, 290);
  }, [selectedUser]);

  function checkSelectedList(id) {
    for (let i = 0; i < selectedUser.length; i++) {
      if (selectedUser[i]._id === id) return true;
    }
    return false;
  }

  return (
    <div className="groupChat">
      <StackSlide slideInfo={slideInfo}>
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
            <div className="grp-heading">
              <h2>Participants</h2>
              <p>
                {selectedUser.length}/{userList.length}
              </p>
            </div>
            <div
              onClick={() => {
                if (selectedUser.length)
                  setSlideInfo({
                    direction: 'right',
                    component: <GroupInfo />,
                  });
              }}
              className={`next ${selectedUser.length ? '' : 'hide'}`}>
              Next
            </div>
          </div>
          <div className="userSearch">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search Users"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </div>

          <GroupParticipants
            selectedUser={selectedUser}
            addParticipants={addParticipants}
          />

          <div className="userList grp">
            {filteredUserList.map((elm, id) => (
              <div key={id}>
                {<UserAvatar imgSrc={elm.photoUrl} size="40px" />}
                <div
                  data-userid={elm._id}
                  className={`grp-user-info ${
                    checkSelectedList(elm._id) ? 'selected' : ''
                  }`}
                  onClick={addParticipants}>
                  <p>{elm.firstName + ' ' + elm.lastName}</p>
                  <div className="grp-include">
                    <div className="grp-include-circle">
                      <span className="grp-include-tick">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="16px"
                          viewBox="0 0 20 20"
                          width="16px">
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </StackSlide>
    </div>
  );
};

export default GroupChat;
