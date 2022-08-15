import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './NewChatRoom.css';
import UserAvatar from '../UserAvatar/UserAvatar';
import useSelectedChat from '../../hooks/useSelectedChat';
import { useSocket } from '../../context/SocketContext';

const NewChatRoom = ({ chatRooms }) => {
  const [userList, setUserList] = useState([]);
  const { currentUser } = useAuth();
  const { selectedChat, setSelectedChat } = useSelectedChat();

  const [searchUser, setSearchUser] = useState('');

  const [filteredUserList, setFilteredUserList] = useState([]);

  const { socket } = useSocket();

  useEffect(() => {
    async function getUserList(payload) {
      if (payload.error) return console.log(payload.error);
      setUserList(payload.response);
    }
    socket.emit('user:list', currentUser._id);
    socket.on('user:list', getUserList);

    return () => socket.off('user:list', getUserList);
  }, [currentUser, socket]);

  async function newMessage(userInfo) {
    const chatRoom = Object.values(chatRooms).filter((elem) =>
      elem.participants.length === 2
        ? elem.participants.includes(userInfo._id)
          ? true
          : false
        : false
    );
    if (chatRoom.length === 1) {
      const { firstName, lastName, photoUrl } = userInfo;
      if (selectedChat?.email !== userInfo.email)
        setSelectedChat({ ...chatRoom[0], firstName, lastName, photoUrl });
    }
    if (!chatRoom.length) {
      const { _id: selectedUserID, firstName, lastName, photoUrl } = userInfo;
      setSelectedChat({
        selectedUserID,
        firstName,
        lastName,
        photoUrl,
      });
    }
  }

  useEffect(() => {
    setFilteredUserList(
      userList.filter((elem) =>
        (elem.firstName + ' ' + elem.lastName).includes(searchUser)
      )
    );
  }, [searchUser, userList]);

  return (
    <div className="newChatRoom">
      <div className="newChatRoomDetail">
        <div className="heading">
          <div
            className="cancel"
            onClick={() => {
              document
                .getElementsByClassName('newChatRoom')[0]
                .classList.remove('show');
            }}>
            Cancel
          </div>
          <h2>Message</h2>
          <div className="next">Next</div>
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
        <div className="userList">
          {filteredUserList.map((elm, id) => (
            <div key={id} onClick={() => newMessage(elm)}>
              {<UserAvatar imgSrc={elm.photoUrl} size="40px" />}
              <p>{elm.firstName + ' ' + elm.lastName}</p>
              <i className="fa-solid fa-message"></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewChatRoom;
