import React, { useEffect } from 'react';
import GroupChat from '../GroupChat/GroupChat';
import NewChatRoom from '../NewChatRoom/NewChatRoom';
import './ChatRooms.css';
import ChatRoomBox from '../ChatRoomBox/ChatRoomBox';
import useChatRoom from '../../hooks/useChatRoom';
import { useSocket } from '../../context/SocketContext';

const ChatGroup = () => {
  const { chatRooms, setChatRooms } = useChatRoom();

  const { socket } = useSocket();

  // useEffect(() => {
  //   function createChatRoom({ newChat }) {
  //     setChatRooms((prev) => ({ ...prev, [newChat._id]: newChat }));
  //   }

  //   socket.on('DB:chatRoom:create', createChatRoom);
  //   return () => socket.off('DB:chatRoom:create');
  // }, [socket, setChatRooms]);

  return (
    <div className={`chatGroup`}>
      <div className="chatRooms">
        <NewChatRoom chatRooms={chatRooms} />
        <GroupChat />
        <h2>Chats</h2>
        <div className="addChatRoom">
          <div
            className="newMember"
            onClick={() => {
              document
                .getElementsByClassName('newChatRoom')[0]
                .classList.add('show');
            }}>
            New Member
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
      <div className="chatRoomList">
        {Object.values(chatRooms).map((elem, id) => {
          return <ChatRoomBox key={id} chatRoomDetail={elem} />;
        })}
      </div>
    </div>
  );
};

export default ChatGroup;
