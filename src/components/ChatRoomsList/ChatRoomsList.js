import React, { useEffect, useRef, useState } from 'react';
import ChatRoomBox from '../ChatRoomBox/ChatRoomBox';
import './ChatRoomsList.css';

const ChatRoomsList = ({ chatRooms }) => {
  const [roomsList, setRoomsList] = useState([]);
  const isMounted = useRef(false);

  useEffect(() => {
    const sortedList = Object.entries(chatRooms).sort(
      (a, b) => -(a[1].updatedAt - b[1].updatedAt)
    );

    setRoomsList(sortedList);
  }, [chatRooms]);

  useEffect(() => {
    if (!roomsList.length) return;

    if (!isMounted.current && roomsList.length) {
      isMounted.current = true;
      roomsList.forEach((elem, id) => {
        console.log(elem, id);
        document.getElementsByClassName(elem[0])[0].style.cssText = `z-index:${
          69 - id
        };transform:translateY(${id * 72}px)`;
      });
      return;
    }

    if (isMounted.current)
      roomsList.forEach((elem, id) => {
        console.log(elem, id);
        document.getElementsByClassName(elem[0])[0].style.cssText = `z-index:${
          69 - id
        };transition: transform 300ms ease-in-out;transform:translateY(${
          id * 72
        }px)`;
      });
  }, [roomsList]);

  return (
    <div className="chatRoomList">
      {Object.values(chatRooms).map((elem) => {
        return <ChatRoomBox key={elem._id} chatRoomDetail={elem} />;
      })}
    </div>
  );
};

export default ChatRoomsList;
