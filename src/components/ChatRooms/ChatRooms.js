import React, { useEffect } from 'react';
import GroupChat from '../GroupChat/GroupChat';
import NewChatRoom from '../NewChatRoom/NewChatRoom';
import './ChatRooms.css';
import { useAuth } from '../../context/AuthContext';
import ChatRoomBox from '../ChatRoomBox/ChatRoomBox';
import { useSocket } from '../../context/SocketContext';
import useChatRoom from '../../hooks/useChatRoom';

const ChatGroup = () => {
  const { currentUser } = useAuth();

  const { chatRooms, setChatRooms } = useChatRoom();

  const { socket } = useSocket();

  useEffect(() => {
    async function getChatList(payload) {
      if (payload.error) return console.log(payload.error);
      setChatRooms(payload.response);
    }
    socket.emit('chatRoom:list', currentUser._id);
    socket.on('chatRoom:list', getChatList);

    return () => socket.off('chatRoom:list', getChatList);
  }, [currentUser, socket, setChatRooms]);

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
        {chatRooms.map((elem, id) => {
          return <ChatRoomBox key={id} chatRoomDetail={elem} />;
        })}
      </div>
    </div>
  );
};

export default ChatGroup;
