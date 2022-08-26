import React, { useState, useEffect, useRef } from 'react';
import GroupChat from '../GroupChat/GroupChat';
import NewChatRoom from '../NewChatRoom/NewChatRoom';
import './ChatRooms.css';
import useChatRoom from '../../hooks/useChatRoom';
import { useSocket } from '../../context/SocketContext';
import UserAvatar from '../UserAvatar/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import ChatRoomsList from '../ChatRoomsList/ChatRoomsList';
import StackSlide from '../StackSlide/StackSlide';
import UserDashboard from '../UserDashboard/UserDashboard';

const ChatGroup = () => {
  const { chatRooms, setChatRooms } = useChatRoom();
  const { currentUser, setUser } = useAuth();
  const loading = useRef(false);
  const socketStatus = useRef('');
  const [slideInfo, setSlideInfo] = useState({ direction: '', component: '' });

  const { socket } = useSocket();

  let container = useRef();

  socket.on('disconnect', () => {
    socketStatus.current = 'socketDisconnected';
  });

  useEffect(() => {
    document.getElementsByTagName('body')[0].addEventListener('click', unSub);

    function unSub(e) {
      if (document.getElementsByClassName('tripleDot')[0].contains(e.target))
        return;
      else if (container.current.contains(e.target)) return;
      else container.current.classList.remove('show');
    }

    return () => {
      document
        .getElementsByTagName('body')[0]
        .removeEventListener('click', unSub);
    };
  }, []);

  useEffect(() => {
    function createChatRoom({ newChatRoom, firstName, lastName, photoUrl }) {
      if (!newChatRoom.GroupChatName)
        newChatRoom = { firstName, lastName, photoUrl, ...newChatRoom };
      setChatRooms((prev) => ({
        ...prev,
        [newChatRoom.chatRoomID]: newChatRoom,
      }));
    }

    socket.on('DB:chatRoom:create', createChatRoom);
    return () => socket.off('DB:chatRoom:create');
  }, [socket, setChatRooms]);

  useEffect(() => {
    function updateChatRoom({ updatedChatRoom }) {
      setChatRooms((prev) => {
        const prevChatRoom = prev[updatedChatRoom.chatRoomID];
        return {
          ...prev,
          [updatedChatRoom.chatRoomID]: { ...prevChatRoom, ...updatedChatRoom },
        };
      });
    }

    socket.on('DB:chatRoom:update', updateChatRoom);
    return () => socket.off('DB:chatRoom:update', updateChatRoom);
  }, [socket, setChatRooms]);

  async function logOut(e) {
    e.preventDefault();
    if (loading.current) return;
    loading.current = true;
    document.body.style.cursor = 'wait';
    await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/logout`, {
      credentials: 'include',
    });
    loading.current = false;
    document.body.style.cursor = 'auto';
    setUser({
      currentUser: null,
      accessToken: null,
    });
  }

  useEffect(() => {
    function sendMessageSync() {
      if (socketStatus.current === 'socketDisconnected')
        socket.emit('chatRoom:list', currentUser._id);
      // socket.emit('message:sync', 'socket reconnected');
      socketStatus.current = '';
    }
    socket.on('message:sync', sendMessageSync);
    return () => socket.off('message:sync', sendMessageSync);
  }, [socket, currentUser]);

  function configureSlideInfo() {
    setSlideInfo({
      direction: 'left',
      component: <UserDashboard setSlideInfo={setSlideInfo}></UserDashboard>,
    });
  }

  useEffect(() => {
    function updateCurrentUserInfo(payload) {
      setUser((prev) => ({ ...prev, currentUser: payload }));
    }
    socket.on('user:currentUser:profile:update', updateCurrentUserInfo);

    return () =>
      socket.off('user:currentUser:profile:update', updateCurrentUserInfo);
  }, [socket, setUser]);

  return (
    <div className={`chatGroup`}>
      <StackSlide
        slideInfo={slideInfo}
        mainContentStyle={{ display: 'flex', flexDirection: 'column' }}>
        <NewChatRoom chatRooms={chatRooms} />
        <GroupChat />
        {/* <StackSlide> */}
        <div className="chatRooms">
          <div className="chatHeader">
            <UserAvatar
              AvatarStyle={{ cursor: 'pointer' }}
              clickFunction={() => configureSlideInfo()}
              imgSrc={currentUser.photoUrl}
              size="40px"></UserAvatar>
            <h2
              onClick={() => configureSlideInfo()}
              style={{ cursor: 'pointer' }}>
              {currentUser.firstName}
            </h2>
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className=""
              onClick={() => {
                document.getElementsByClassName('newMember')[0].click();
              }}>
              <path
                fill="currentColor"
                d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"></path>
            </svg>
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="tripleDot"
              onClick={() => container.current.classList.toggle('show')}>
              <path
                fill="currentColor"
                d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"></path>
            </svg>
            <div className="userDropDown" ref={container}>
              <ul>
                <li
                  onClick={() =>
                    document.getElementsByClassName('newMember')[0].click()
                  }>
                  New message
                </li>
                <li
                  onClick={() =>
                    document.getElementsByClassName('newGroup')[0].click()
                  }>
                  New group
                </li>
                <li>Setting</li>
                <li onClick={logOut}>Log out</li>
              </ul>
            </div>
          </div>
          <div className="addChatRoom">
            <div
              className="newMember"
              onClick={() => {
                document
                  .getElementsByClassName('newChatRoom')[0]
                  .classList.add('show');
              }}>
              New Message
            </div>
            <div
              className="newGroup"
              onClick={() => {
                document
                  .getElementsByClassName('groupChat')[0]
                  .classList.add('show');
              }}>
              New Group
            </div>
          </div>
        </div>
        {/* </StackSlide> */}
        <ChatRoomsList chatRooms={chatRooms} />
      </StackSlide>
    </div>
  );
};

export default ChatGroup;
